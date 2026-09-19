
import conexao from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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
            [nome, email, senhaCriptografada, "usuario"]
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


// LOGIN
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
        const senhaConfere = await bcrypt.compare(senha, usuario.senha);

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
            { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
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


export const perfil = async (req, res) => {
    res.status(200).json({ usuario: req.usuarios });
};

export const listarUsuarios = async (req, res) => {
    try {
        const [usuarios] = await conexao.query("SELECT * FROM usuarios");
        res.status(200).json({ usuarios });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
};
