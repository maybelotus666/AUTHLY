
import conexao from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { google } from "googleapis";

const googleClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5173"
);

console.log(
    "CLIENT ID:",
    process.env.GOOGLE_CLIENT_ID
);

console.log(
    "CLIENT SECRET EXISTE:",
    !!process.env.GOOGLE_CLIENT_SECRET
);

console.log(
    "CLIENT SECRET:",
    process.env.GOOGLE_CLIENT_SECRET
);

export const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: "Preencha nome, email e senha."
            });
        }

        const [existentes] = await conexao.query(
            "SELECT id FROM usuarios WHERE email = ?",
            [email]
        );

        if (existentes.length > 0) {
            return res.status(409).json({
                mensagem: "Esse email já está cadastrado."
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await conexao.query(
            `
            INSERT INTO usuarios
            (nome, email, senha, role)
            VALUES (?, ?, ?, ?)
            `,
            [
                nome,
                email,
                senhaCriptografada,
                "ouvinte"
            ]
        );

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!"
        });

    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
};



export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Preencha email e senha."
            });
        }

        const [resultado] = await conexao.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );

        if (resultado.length === 0) {
            return res.status(401).json({
                mensagem: "Email ou senha inválidos."
            });
        }

        const usuario = resultado[0];

        // Usuário criado pelo Google pode não ter senha
        if (!usuario.senha) {
            return res.status(401).json({
                mensagem: "Essa conta utiliza o login com Google."
            });
        }

        const senhaConfere = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaConfere) {
            return res.status(401).json({
                mensagem: "Email ou senha inválidos."
            });
        }

        const payload = {
            id: usuario.id,
            nome: usuario.nome,
            role: usuario.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || "2h"
            }
        );

        res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,
            usuario: payload
        });

    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
};


export const loginGoogle = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                mensagem: "Código do Google não recebido."
            });
        }

        // Troca o código recebido do Google
        // pelos tokens da conta
        const { tokens } = await googleClient.getToken(code);

        if (!tokens.id_token) {
            return res.status(401).json({
                mensagem: "Não foi possível validar a conta Google."
            });
        }

        // Valida o ID Token
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const dadosGoogle = ticket.getPayload();

        const googleId = dadosGoogle.sub;
        const email = dadosGoogle.email;
        const nome = dadosGoogle.name;

        if (!googleId || !email) {
            return res.status(400).json({
                mensagem: "Não foi possível obter os dados da conta Google."
            });
        }

        const [usuariosGoogle] = await conexao.query(
            "SELECT * FROM usuarios WHERE google_id = ?",
            [googleId]
        );

        let usuario;

        if (usuariosGoogle.length > 0) {
            usuario = usuariosGoogle[0];
        } else {

    

            const [usuariosEmail] = await conexao.query(
                "SELECT * FROM usuarios WHERE email = ?",
                [email]
            );

            if (usuariosEmail.length > 0) {

                // Usuário já tinha uma conta normal.
                // Vamos vincular essa conta ao Google.

                usuario = usuariosEmail[0];

                await conexao.query(
                    `
                    UPDATE usuarios
                    SET google_id = ?
                    WHERE id = ?
                    `,
                    [googleId, usuario.id]
                );

            } else {

                const [resultado] = await conexao.query(
                    `
                    INSERT INTO usuarios
                    (nome, email, senha, google_id, role)
                    VALUES (?, ?, ?, ?, ?)
                    `,
                    [
                        nome,
                        email,
                        null,
                        googleId,
                        "ouvinte"
                    ]
                );

                usuario = {
                    id: resultado.insertId,
                    nome,
                    email,
                    senha: null,
                    google_id: googleId,
                    role: "ouvinte"
                };
            }
        }


        const payload = {
            id: usuario.id,
            nome: usuario.nome,
            role: usuario.role
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || "2h"
            }
        );



        return res.status(200).json({
            mensagem: "Login com Google realizado com sucesso!",
            token,
            usuario: payload
        });

    } catch (erro) {
        console.error("Erro no login Google:", erro);

        return res.status(500).json({
            mensagem: "Erro ao realizar login com Google."
        });
    }
};



export const perfil = async (req, res) => {
    res.status(200).json({
        usuario: req.usuarios
    });
};


export const listarUsuarios = async (req, res) => {
    try {
        const [usuarios] = await conexao.query(
            "SELECT * FROM usuarios"
        );

        res.status(200).json({
            usuarios
        });

    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
};


export const mostrarMusicas = async (req, res) => {
    try {
        const [musicas] = await conexao.query(
            "SELECT * FROM musicas"
        );

        res.status(200).json({
            musicas
        });

    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
};