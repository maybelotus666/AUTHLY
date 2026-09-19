import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

function verificarToken(req, res, next){
    const authHeader = req.headers['authorization'] // Bearer <token>

    if(!authHeader){
        return res.status(401).json({mensagem: "Token não fornecido"})
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, usuarioDecodificado) => {
        if(err){
            return res.status(403).json({mensagem: "Token invalido ou expirado"})
        }

        req.usuarios = usuarioDecodificado;
        next()
    })
}

function verificarMusico(req, res, next) {
    const usuario = req.usuarios;

    if (!usuario || usuario.role !== 'musico') {
        return res.status(403).json({ mensagem: "Acesso negado. Requer privilégios de musico ૮ ˶ᵔ ᵕ ᵔ˶ ა " });
    }

    next();
}

export { verificarToken, verificarMusico };
