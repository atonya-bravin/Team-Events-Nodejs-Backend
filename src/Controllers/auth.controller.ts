import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { authUrl, oauth2Client, google } from '../config/google.config'
import { generateToken } from '../utils'
import passport from 'passport'
const prisma = new PrismaClient()

const googleAuth = (req: Request, res: Response) => {
  res.redirect(authUrl)
}

const callback = async (req: Request, res: Response) => {
  const code = req.query.code as string

  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data } = await oauth2.userinfo.get()

    const userExists = await prisma.user.findFirst({
      where: {
        auth_id: data.id,
      },
    })

    if (!userExists) {
      const newUser = await prisma.user.create({
        data: {
          auth_method: 'google',
          auth_id: data.id,
          email: data.email ? data.email : null,
        },
      })

      //generate accessToken
      const token: string = generateToken(newUser.id)
      //return token
      res.status(201).json({
        statusCode: 201,
        message: 'User created',
        data: {
          id: newUser.id,
          token,
        },
      })
    } else {
      //generate access token
      const token: string = generateToken(userExists.id)
      //return token
      res.status(200).json({
        statusCode: 200,
        message: 'User login successful',
        data: {
          id: userExists.id,
          token,
        },
      })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(500).send('Authentication error')
  } finally {
    // Close the Prisma client at the end of the function
    prisma.$disconnect()
  }
}

const twitterAuth = (req: Request, res: Response) => {
    //start the twitter authentication flow
    passport.authenticate('twitter')(req, res);
}

//controller function to handle the twitter callback
const twitterAuthCallback = (req: Request, res: Response) => {
    //handle twitter callback
    passport.authenticate('twitter', (err: any, user: any) => {
        if (err) {
            //handle authentication errors
            return res.status(500).json({ error: 'Authentication error'});
        }
        if (!user) {
            //authentication failed
            return res.status(401).json({ error: 'Authentication failed'});
        }

        //authentication succeeded
        const accessToken = generateToken(user.id);
        res.status(200).json({ user, accessToken });
    })(req, res);
};

const logout = (req: Request, res: Response) => {
    (req as any).logout(); //logout the user

    res.redirect('/') //redirects to the homepage
}

export { googleAuth, twitterAuth, logout, callback, twitterAuthCallback }
