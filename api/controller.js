const express = require('express');
const User = require('./model');
const api = express.Router();


const isLogged = ({ session } , res, next) => {
      if(!session.user){
          res.status(403).json({
              status : 'You are not logged in'
          });
      }else {
         next();
      }
}

const isNotLogged = ({ session }, req, res)=>{
      if(session.user){
          res.status(403).json({
             status: "You are already loggedin"
          })
      }else{
         next();
      }
}


api.post('/login', isNotLogged , async (req. res)=>{
    try {
       const {session, body} = req;
       const {username, password} = body;
       const user = await User(username, password);
             session.user = {
                 _id : user.id,
                 username: user.username
             }
             session.save(()=>{
                res.status(200).json({
                   status  : 'Welcome'
                })
             })
    }catch(error) {
        res.status(403).json({
            error : error.message
        })
    }
})

api.post('/logout', isLogged, (req, res)=>{
    req.session.destroy();
    res.status(200).json({
        status: "Successfully logout"
    })
});


api.post('/signup', (req, res)=>{
    try {
      const {session, body } = req;
      const {username, password} = body;
      const user = await User.signup(username, password);
            res.status(201).json({
                status: "Created!"
            })
    }catch(error){
      res.status(403).json({
          error : error.message
      });
    }
})


api.post('/profile', isLogged, (req, res)=>{
    const { user } = req.session;
    res.status(200).json({ user });
})

api.put('/changepass', isLogged,  async (req, res)=>{
    try {
      const { session, body } = req;
      const {password} = body;
      const {_id }  = session.user;
      const user = await User.findById({_id});
      if(user){
         await user.changepass(password);
         res.status(200).json({
             status: "Pwd changed"
         })
      }else{
        res.status(403).json({
           status: user
        })
      }
    }catch(error) {
      res.status(403).json({
          error : error.message
      });
    }
})
