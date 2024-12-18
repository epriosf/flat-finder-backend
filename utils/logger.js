import winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const customLevelOptions = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'red',
    warning: 'yellow',
    info: 'green',
    debug: 'blue',
  },
};

// const fileTransport = new winston.transports.DailyRotateFile({
//   dirname: './logs',
//   filename: 'application-%DATE%.log', //application-2024-10-25.log, application-2024-10-26.log
//   datePattern: 'YYYY-MM-DD-HH-mm',
//   //vamos a definir una politica de retencion de archivos
//   //vamos a comprimir los archivos que ya no se esten usando
//   zippedArchive: true,
//   //Vamos a definir el tamaño maximo de los archivos
//   maxSize: '1m',
//   //Vamos a definir el numero maximo de archivos que vamos a tener disponibles, una ves que lleguemos a este numero
//   //automaticamente los archivos mas viejos se van a eliminar
//   maxFiles: 3,
//   //Vamos a definir la frecuencia en tiempo que queremos segmentar nuestros logs
//   frequency: '1m',
//   level: 'debug',
// });

//Vamos a crear nuestro logger
//Para esto tenemos que definir un transporte
const logger = winston.createLogger({
  levels: customLevelOptions.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({
          all: true,
          colors: customLevelOptions.colors,
        })
      ),
    }),
    // fileTransport,
  ],
});

export default logger;
