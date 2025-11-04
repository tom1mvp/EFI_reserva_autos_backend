const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(403).json({ message: 'Token requerido' })

    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Formato invalido' })
    }

    try {
        const secret = process.env.JWT_SECRET || 'AbcDLZ'
        const decodedToken = jwt.verify(token, secret)
        req.user = decodedToken
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token invalido o expirado' })
    }

}

module.exports = verifyToken