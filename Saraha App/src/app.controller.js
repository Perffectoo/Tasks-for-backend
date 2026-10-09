import { authRouter, messageRouter, userRouter } from "./Modules/index.js";
import { successResponse } from "./Utils/response/success.response.js";
import {
    BadRequestException,
    globalErrorHandler
} from "./Utils/response/error.response.js";
import connectDB from "./DB/connections.js";
const bootstrap = async (app, express) => {

    app.use(express.json());

    await connectDB();

    app.get('/', (req, res) => {
        successResponse({
            res,
            statusCode: 200,
            message: "Welcome to Saraha API",
            data: { message: "Welcome to Saraha API" }
        });
    });

    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/roles', messageRouter);


    app.all('/*dummy', (req, res) => {
        throw BadRequestException({ message: "Not found Handler!!" })
    });

    app.use(globalErrorHandler);



};

export default bootstrap;