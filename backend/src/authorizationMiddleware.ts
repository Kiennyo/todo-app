import {NextFunction, Request, Response} from "express"
import {CognitoJwtVerifier} from "aws-jwt-verify";

// TODO configure this middleware so we could send our locally generated tokens for testing

const verifier = CognitoJwtVerifier.create({
    tokenUse: "access",
    userPoolId: process.env.USER_POOL_ID || "",
    clientId: process.env.CLIENT_ID || "",
});

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = await verifier.verify(req.headers.authorization || "");
        req.subject = payload.sub
        next();
    } catch(err) {
        res.status(403).json({error: "Forbidden"})
    }
}