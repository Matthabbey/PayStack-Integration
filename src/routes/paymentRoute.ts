import express from 'express';
import {CreatePayment, CreateverifyPayment} from '../controller/paystackController';
import { authentication } from '../middlewares/authentication';

const paystackRoute = express.Router();

// Need to apply validation
paystackRoute.post('/initialize', authentication, CreatePayment);
paystackRoute.get('/verify', CreateverifyPayment);

export default paystackRoute;