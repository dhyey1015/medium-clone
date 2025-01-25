import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
    
    

  const app = new Hono<{
    Bindings:{
      DATABASE_URL: string;
      SECRET_KEY: string;
    }
  }>()

  //Routing 
  app.route("/api/v1/user", userRouter);
  app.route("/api/v1/blog", blogRouter);

//   app.post('/api/v1/user/signup', async (c) =>  {
//     const body = await c.req.json();
    
//     const prisma = new PrismaClient({
//       datasourceUrl: c.env.DATABASE_URL
//     }).$extends(withAccelerate())

//     try{
//     const user = await prisma.user.create({
//         data:{
//           username: body.username,
//           name: body.name,
//           password: body.password,
//         }
//       })
//       const jwt = await sign({
//         id: user.id 
//       },c.env.SECRET_KEY)

//       return c.json({
//         "message": "Signed-Up",
//         "Token": jwt
//       });
//     } catch(e) {
//       c.status(411);
//       return c.text('User already exist with this email');
//     } 
//   })

// app.post('/api/v1/user/signin', async (c) => {
//   const body = await c.req.json();
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL
//   }).$extends(withAccelerate());
//   try{
//     const user = await prisma.user.findFirst({
//       where:{
//         username: body.username,
//         password: body.password,
//       }
//     });
//     if(!user){
//       c.status(403);
//       return c.json({
//         "message":"Invalid Username or password"
//       });
//     } else{
//       const jwt = await sign({
//         id: user.id
//       }, c.env.SECRET_KEY);
//       c.status(200);
//       return c.json({
//         "message":"Signed In Successfully!", 
//         "Token" : jwt
//       }); 
//     }
//   } catch (e){

//   }
//   return c.text('Hello Hon  o!');
// })

// app.post('/api/v1/blog', (c) =>{
//   return c.text('heelo');
// })


// app.put('/api/v1/blog', (c) => {
//   return c.text('ehl');
// })
 
// app.get('/api/v1/blog/:id', (c) => {
//   return c.text('ebdcu');
// })

// app.get('/api/v1/blog/bulk', (c)=> {
//   return c.text('huduc');
// })
export default app
