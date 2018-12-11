import chai from 'chai';
import mongoose from 'mongoose';
// import { Mockgoose } from 'mockgoose';
import chaiHttp from 'chai-http';
import server from '../server';
// import config from '../src/config/config';

// const mockgoose = new Mockgoose(mongoose);

chai.should();
chai.use(chaiHttp);