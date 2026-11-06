import {WHITE_LIST} from '../../../Config/config.service.js';
import { BadRequestException } from '../response/error.response.js';


export function corsOptions() {
  const whiteList = WHITE_LIST.split(",");
  const corsOptions = {
    origin: function (origin, callback) {
      if (whiteList.includes(origin)) {
        callback(null, true);
      } else if(!origin){
        callback(null, true);
      } else {
        callback(BadRequestException({ message: "not Allowed By CORS" }));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
  };

  return corsOptions;
}