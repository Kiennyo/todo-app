import {NextFunction, Request, Response} from "express"
import {CognitoJwtVerifier} from "aws-jwt-verify";
import {CognitoJwtVerifierSingleUserPool, CognitoVerifyProperties} from "aws-jwt-verify/cognito-verifier";

let verifier: CognitoJwtVerifierSingleUserPool<CognitoVerifyProperties & {userPoolId: string}>

if (!process.env.IS_OFFLINE) {
    verifier = CognitoJwtVerifier.create({
        tokenUse: "access",
        userPoolId: process.env.USER_POOL_ID || "",
        clientId: process.env.CLIENT_ID || "",
    });
}

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = await verifier.verify(req.headers.authorization || "");
        req.subject = payload.sub
        next();
    } catch(err) {
        res.status(403).json({error: "Forbidden"})
    }
}

export const localAuthorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    req.subject = "local-user"
    next();
}