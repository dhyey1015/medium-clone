import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { signInInput, signUpInput } from "@dhyey1015/medium-clone-common"



export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        SECRET_KEY: string;
    }
}>()

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signUpInput.safeParse(body);
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    if (!success){
      c.status(411);
      return c.json({
        message: "Please provide correct inputs properly"
      })
    } 
    else {
      try{
        const user = await prisma.user.create({
            data:{
              username: body.username,
              name: body.name,
              password: body.password,
            }
          })
          const jwt = await sign({
            id: user.id 
          },c.env.SECRET_KEY)
    
          return c.json({
            "message": "Signed-Up",
            "Token": jwt
          });
      } catch(e) {
        c.status(411);
        return c.text('User already exist with this email');
      } 
    }
});

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signInInput.safeParse(body);
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  if(!success){
    c.status(404)
    return c.json({
      message: "Invalide input"
    })
  } 
  else {
    try{
      const user = await prisma.user.findFirst({
        where:{
          username: body.username,
          password: body.password,
        }
      });
      if(!user){
        c.status(403);
        return c.json({
          "message":"Invalid Username or password"
        });
      } else{
        const jwt = await sign({
          id: user.id
        }, c.env.SECRET_KEY);
        c.status(200);
        return c.json({
          "message":"Signed In Successfully!", 
          "Token" : jwt
        }); 
      }
    } catch (e){
      c.status(404)
      return c.json({
        message: "Wrong email or password"
      })
    }
  } 
});
