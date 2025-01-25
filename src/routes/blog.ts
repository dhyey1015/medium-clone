import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string;
        SECRET_KEY: string;
    },
    Variables:{
        userId: string;
    }
}>()
// authentication same as middle where check for the authorizartion token in headers
// if found verify it, if okay the extract data from it and pass that data to end point function

//-------------------------authentication-Hono-syntax-----------------------------
blogRouter.use("/*", async (c, next) => {
    try{

        const authHeader = c.req.header('authorization')|| "";
        if(authHeader != ""){
            const user = await verify(authHeader, c.env.SECRET_KEY) as {id: string};
            c.set("userId", user.id);
            await next();
        }else{
            return c.json({
                message: "Please provide authorization token"
            })
        }
    } catch(e){
        return c.json({
            message: "you are not logged in"
        })
    }
    
    
});

blogRouter.post('/new-blog', async (c, next) =>{
    const body = await c.req.json();
    const userId = c.get('userId');

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
        const blog = await prisma.blog.create({
            data:{
                title: body.title,
                content:  body.content,
                authorId: parseInt(userId)
            }
        })
        c.status(201)
        return c.json({
            "message": "Successfully created blog post",
            "created_blog_id": blog.id
        })
    } catch (e){
        c.status(400)
        return c.json({
            "message": "Some unexpected error occurred",
            "error": `${e}`
        })
    }
    
});

blogRouter.put('/edit-blog', async (c) => {
    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.update({
            where:{
                id: body.id
            },
            data:{
                title: body.title,
                content: body.content,
            }
        });
        c.status(200);
        return c.json({
            message: "your blog updated successfully",
            "your_updated_blog's_id": blog.id
        });
    } catch(e){
        c.status(404);
        return c.json({
            message: "something went  wrong",
            "error": `${e}`
        })
    }
});
   
blogRouter.get('get-blog/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

   try{
        const blogs = await prisma.blog.findFirst({
            where:{
                id: parseInt(id)
            }
        });
        c.status(200)
        return c.json({
            blogs
        })
   } catch (e){
        c.status(404);
        return c.json({
            message: "something when wrong",
            "error": `${e}`
        })
   }
});
  //TODO: add pagination
blogRouter.get('/all-blog', async (c)=> {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
    try{
        const blog = await prisma.blog.findMany();
        c.status(200)
        return c.json({
            blog
        })
    } catch (e){
        c.status(404);
        return c.json({
            message: "something when wrong",
            "error": `${e}`
        })
    }
});
