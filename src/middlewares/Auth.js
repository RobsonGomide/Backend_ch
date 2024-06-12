const User1 = require("../models/Users");

module.exports = {
    private: async (req, res, next) => {
        if(!req.body.token && !req.query.token) {
            res.json({notallowed: true});
            return;
        }

        let token = '';

        if(req.body.token) { 
            token = req.body.token; 
        }

        if(req.query.token) { 
            token = req.query.token.toString();
        }

        if(token === '') {
            res.json({notallowed: true});
            return;
        }

        let user = await User1.User.findOne({where: {token}});
        if(!user) {
            res.json({notallowed: true});
            return;
        }

        next();

    }
}