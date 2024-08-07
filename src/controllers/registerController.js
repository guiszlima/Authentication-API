const bcrypt = require('bcrypt');

const ValidateEmail = require('../../commons/ValidateEmail');
const User = require('../models/Users');

    module.exports.register = async (req, res) => {
        const { name, email, password } = req.body;
        console.log(name,email,password)
        // Verifica se todos os campos obrigatórios foram fornecidos
        if (!name || !email || !password) {
            return res.status(422).json({ error: 'Todos os campos são obrigatórios: nome, email e senha.' });
        }

        // Valida o formato do email
        if (!ValidateEmail(email)) {
            return res.status(422).json({ error: 'Email inválido.' });
        }

        try {
            // Verifica se o usuário já existe
            const userExists = await User.findOne({ where: { email: email } });
            if (userExists) {
                return res.status(422).json({ error: 'Este email já está sendo utilizado. Por favor, utilize outro.' });
            }

            // Gera um hash seguro da senha
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            // Cria o usuário no banco de dados
            const newUser = await User.create({
                name: name,
                email: email,
                password: passwordHash,
            });

            // Retorna o novo usuário criado
            return res.status(201).json({msg:'Registrado com Sucesso!'});
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            return res.status(500).json({ error: 'Erro interno ao registrar usuário. Por favor, tente novamente mais tarde.' });
        }
    }


