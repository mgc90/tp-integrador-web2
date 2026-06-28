import sequelize from '../models/config.js';
import { initializeAssociations } from '../models/index.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Image } from '../models/Image.js';
import { Tag } from '../models/Tag.js';
import { Comment } from '../models/Comment.js';
import { Valoration } from '../models/Valoration.js';
import { Interest } from '../models/Interest.js';
import { Follow } from '../models/Follow.js';
import { Collection } from '../models/Collection.js';
import { CollectionPost } from '../models/CollectionPost.js';

const userRows = [
  {
    "id": 2,
    "firstName": "Matías",
    "lastName": "Correa",
    "email": "matigc90@gmail.com",
    "avatar": null,
    "watermarkText": null,
    "rol": "admin",
    "password": "$2b$10$ohG1lnnLhyHjCZXFT5xUeuqTrOR4YJYxIrvd0rXxIoUlJfHa5w4bO",
    "createdAt": "2026-06-09T03:25:42.090Z",
    "updatedAt": "2026-06-09T03:25:42.090Z"
  },
  {
    "id": 3,
    "firstName": "Pepito",
    "lastName": "Catalan",
    "email": "pepitocatalan@algo.com",
    "avatar": null,
    "watermarkText": null,
    "rol": "user",
    "password": "$2b$10$TChwhv3s6a0T7644ccHN/OrEOPUFl6AClz.3KX/Eoh.b2LpOQyDtS",
    "createdAt": "2026-06-09T04:31:21.012Z",
    "updatedAt": "2026-06-09T04:31:21.012Z"
  },
  {
    "id": 4,
    "firstName": "Omar",
    "lastName": "Bakistata",
    "email": "omarbakistata@algo.com",
    "avatar": null,
    "watermarkText": null,
    "rol": "validator",
    "password": "$2b$10$17/9DT/ys/Hz8FpUGJTh1O7C27dFNCIaQv34RC1hlKHE9C7fdnIVe",
    "createdAt": "2026-06-09T05:21:21.913Z",
    "updatedAt": "2026-06-09T05:21:21.913Z"
  },
  {
    "id": 5,
    "firstName": "Ron",
    "lastName": "Damón",
    "email": "rondamon@algo.com",
    "avatar": null,
    "watermarkText": null,
    "rol": "user",
    "password": "$2b$10$vlCCgygOjtxZXytYE/c40.5s8KLclSTyy/IBmf7dTNRM9KMIrQvQa",
    "createdAt": "2026-06-09T06:18:24.531Z",
    "updatedAt": "2026-06-09T06:18:24.531Z"
  },
  {
    "id": 6,
    "firstName": "Goku",
    "lastName": "Sayayin",
    "email": "gokusayayin@algo.com",
    "avatar": null,
    "watermarkText": null,
    "rol": "user",
    "password": "$2b$10$EaG3zituP4eCyJeR.VUn4ey8g5aISGKH4mDp6QYsyUEfCBdF1Vyhi",
    "createdAt": "2026-06-09T14:18:18.215Z",
    "updatedAt": "2026-06-09T14:18:18.215Z"
  },
  {
    "id": 7,
    "firstName": "Carlos",
    "lastName": "Bilardo",
    "email": "carlosbilardo@algo.com",
    "avatar": "/imgs/defaultUser.jpg",
    "watermarkText": null,
    "rol": "user",
    "password": "$2b$10$AmAbQqHoNt7zrL5QHG6rNOayKYmX9QEP7YUUILFLR9r53BNzHuC9S",
    "createdAt": "2026-06-11T03:17:02.213Z",
    "updatedAt": "2026-06-11T03:17:02.213Z"
  }
];

const tagRows = [
  {
    "id": 9,
    "name": "algo",
    "createdAt": "2026-06-09T03:28:14.239Z",
    "updatedAt": "2026-06-09T03:28:14.239Z"
  },
  {
    "id": 10,
    "name": "jaja",
    "createdAt": "2026-06-09T03:28:14.301Z",
    "updatedAt": "2026-06-09T03:28:14.301Z"
  },
  {
    "id": 11,
    "name": "hola",
    "createdAt": "2026-06-09T03:28:14.354Z",
    "updatedAt": "2026-06-09T03:28:14.354Z"
  },
  {
    "id": 12,
    "name": "otracosa",
    "createdAt": "2026-06-09T04:30:12.679Z",
    "updatedAt": "2026-06-09T04:30:12.679Z"
  },
  {
    "id": 13,
    "name": "naturaleza",
    "createdAt": "2026-06-09T04:30:12.872Z",
    "updatedAt": "2026-06-09T04:30:12.872Z"
  },
  {
    "id": 14,
    "name": "comida",
    "createdAt": "2026-06-09T04:30:12.895Z",
    "updatedAt": "2026-06-09T04:30:12.895Z"
  },
  {
    "id": 15,
    "name": "sonido",
    "createdAt": "2026-06-09T05:07:58.054Z",
    "updatedAt": "2026-06-09T05:07:58.054Z"
  },
  {
    "id": 16,
    "name": "imagen",
    "createdAt": "2026-06-09T05:07:58.255Z",
    "updatedAt": "2026-06-09T05:07:58.255Z"
  },
  {
    "id": 17,
    "name": "onda",
    "createdAt": "2026-06-09T05:07:58.273Z",
    "updatedAt": "2026-06-09T05:07:58.273Z"
  },
  {
    "id": 18,
    "name": "pc",
    "createdAt": "2026-06-09T05:25:29.279Z",
    "updatedAt": "2026-06-09T05:25:29.279Z"
  },
  {
    "id": 19,
    "name": "informatica",
    "createdAt": "2026-06-09T05:25:29.378Z",
    "updatedAt": "2026-06-09T05:25:29.378Z"
  },
  {
    "id": 20,
    "name": "nerd",
    "createdAt": "2026-06-09T05:25:29.387Z",
    "updatedAt": "2026-06-09T05:25:29.387Z"
  },
  {
    "id": 21,
    "name": "informática",
    "createdAt": "2026-06-09T05:26:52.622Z",
    "updatedAt": "2026-06-09T05:26:52.622Z"
  },
  {
    "id": 22,
    "name": "pibe",
    "createdAt": "2026-06-09T05:26:52.655Z",
    "updatedAt": "2026-06-09T05:26:52.655Z"
  },
  {
    "id": 23,
    "name": "actor",
    "createdAt": "2026-06-09T06:20:38.037Z",
    "updatedAt": "2026-06-09T06:20:38.037Z"
  },
  {
    "id": 24,
    "name": "elchavo",
    "createdAt": "2026-06-09T06:20:38.119Z",
    "updatedAt": "2026-06-09T06:20:38.119Z"
  },
  {
    "id": 25,
    "name": "tele",
    "createdAt": "2026-06-09T06:20:38.129Z",
    "updatedAt": "2026-06-09T06:20:38.129Z"
  },
  {
    "id": 26,
    "name": "sayayin",
    "createdAt": "2026-06-09T14:22:52.122Z",
    "updatedAt": "2026-06-09T14:22:52.122Z"
  },
  {
    "id": 27,
    "name": "esferasdeldragon",
    "createdAt": "2026-06-09T14:22:52.551Z",
    "updatedAt": "2026-06-09T14:22:52.551Z"
  },
  {
    "id": 28,
    "name": "dibujo",
    "createdAt": "2026-06-09T14:22:52.572Z",
    "updatedAt": "2026-06-09T14:22:52.572Z"
  },
  {
    "id": 29,
    "name": "supersayayin",
    "createdAt": "2026-06-09T14:27:35.613Z",
    "updatedAt": "2026-06-09T14:27:35.613Z"
  },
  {
    "id": 30,
    "name": "esferadeldragon",
    "createdAt": "2026-06-09T14:27:36.321Z",
    "updatedAt": "2026-06-09T14:27:36.321Z"
  },
  {
    "id": 31,
    "name": "pelea",
    "createdAt": "2026-06-09T14:27:36.345Z",
    "updatedAt": "2026-06-09T14:27:36.345Z"
  },
  {
    "id": 32,
    "name": "futbol",
    "createdAt": "2026-06-11T03:22:01.242Z",
    "updatedAt": "2026-06-11T03:22:01.242Z"
  },
  {
    "id": 33,
    "name": "gatorei",
    "createdAt": "2026-06-11T03:23:10.420Z",
    "updatedAt": "2026-06-11T03:23:10.420Z"
  }
];

const postRows = [
  {
    "id": 4,
    "title": "Esto pasa a veces en la cocina",
    "description": "Esto pasa a veces significa que ocurre de vez en cuando o una vez cada tanto, por eso es algo que no pasa siempre.",
    "userId": 2,
    "createdAt": "2026-06-09T03:28:14.138Z",
    "updatedAt": "2026-06-11T01:09:19.981Z"
  },
  {
    "id": 5,
    "title": "Es para publicar otra cosa",
    "description": "No hay ningún otro motivo expresso más que ese y las tortita.",
    "userId": 2,
    "createdAt": "2026-06-09T04:30:12.515Z",
    "updatedAt": "2026-06-09T04:30:20.778Z"
  },
  {
    "id": 6,
    "title": "sonido",
    "description": "imagen de sonido",
    "userId": 3,
    "createdAt": "2026-06-09T05:07:57.944Z",
    "updatedAt": "2026-06-09T05:07:57.944Z"
  },
  {
    "id": 7,
    "title": "Acá haciendo lo que hay que hacer",
    "description": "Siempre que se presente la situación dada por el contexto subyacente a la matriz de adyacencia del algoritmo del logaritmo.",
    "userId": 4,
    "createdAt": "2026-06-09T05:25:29.130Z",
    "updatedAt": "2026-06-09T05:25:29.130Z"
  },
  {
    "id": 8,
    "title": "La informática pibe, la informática",
    "description": "NO hay",
    "userId": 4,
    "createdAt": "2026-06-09T05:26:52.574Z",
    "updatedAt": "2026-06-09T05:26:52.574Z"
  },
  {
    "id": 9,
    "title": "No te doy otra nomás porque...",
    "description": "Actuando",
    "userId": 5,
    "createdAt": "2026-06-09T06:20:37.902Z",
    "updatedAt": "2026-06-09T06:20:37.902Z"
  },
  {
    "id": 10,
    "title": "Mi modo Super Sayayin",
    "description": "Cuando me pongo en supersayayin me olvido un poco de todo pero me encanta. La primera imagen es cuando estaba a punto de liquidar a freezer, un día muy agitado y en el cual terminé muy cansado. La segunda es una ilustración hecha por un amigo, tiene copyright. Cualquier cosa me contactan para comprarla o si saben de alguna esfera del dragón que ande por ahí suelta",
    "userId": 6,
    "createdAt": "2026-06-09T14:22:51.961Z",
    "updatedAt": "2026-06-09T14:22:51.961Z"
  },
  {
    "id": 11,
    "title": "Supersayayin 3",
    "description": "Acá en modo supersayayin 3, no recuerdo bien qué parte porque cuando estoy en ese modo pierdo un poco la memoria",
    "userId": 6,
    "createdAt": "2026-06-09T14:27:35.480Z",
    "updatedAt": "2026-06-09T14:27:35.480Z"
  },
  {
    "id": 12,
    "title": "Otra cosa 2",
    "description": "también sobre sonido",
    "userId": 3,
    "createdAt": "2026-06-10T04:37:49.371Z",
    "updatedAt": "2026-06-10T04:37:49.371Z"
  },
  {
    "id": 13,
    "title": "Hola mi nombre es Carlos",
    "description": "Técnico campeón del mundo con Argentina en el mundial México 1986",
    "userId": 7,
    "createdAt": "2026-06-11T03:22:01.079Z",
    "updatedAt": "2026-06-11T03:22:01.079Z"
  },
  {
    "id": 14,
    "title": "Esto es gatorei",
    "description": "no lo conocía nadie a gatorei.",
    "userId": 7,
    "createdAt": "2026-06-11T03:23:10.308Z",
    "updatedAt": "2026-06-11T03:23:10.308Z"
  }
];

const postTagRows = [
  {
    "createdAt": "2026-06-09T03:28:14.290Z",
    "updatedAt": "2026-06-09T03:28:14.290Z",
    "postId": 4,
    "tagId": 9
  },
  {
    "createdAt": "2026-06-09T03:28:14.345Z",
    "updatedAt": "2026-06-09T03:28:14.345Z",
    "postId": 4,
    "tagId": 10
  },
  {
    "createdAt": "2026-06-09T03:28:14.358Z",
    "updatedAt": "2026-06-09T03:28:14.358Z",
    "postId": 4,
    "tagId": 11
  },
  {
    "createdAt": "2026-06-09T04:30:12.854Z",
    "updatedAt": "2026-06-09T04:30:12.854Z",
    "postId": 5,
    "tagId": 12
  },
  {
    "createdAt": "2026-06-09T04:30:12.881Z",
    "updatedAt": "2026-06-09T04:30:12.881Z",
    "postId": 5,
    "tagId": 13
  },
  {
    "createdAt": "2026-06-09T04:30:12.901Z",
    "updatedAt": "2026-06-09T04:30:12.901Z",
    "postId": 5,
    "tagId": 14
  },
  {
    "createdAt": "2026-06-09T05:07:58.245Z",
    "updatedAt": "2026-06-09T05:07:58.245Z",
    "postId": 6,
    "tagId": 15
  },
  {
    "createdAt": "2026-06-09T05:07:58.264Z",
    "updatedAt": "2026-06-09T05:07:58.264Z",
    "postId": 6,
    "tagId": 16
  },
  {
    "createdAt": "2026-06-09T05:07:58.278Z",
    "updatedAt": "2026-06-09T05:07:58.278Z",
    "postId": 6,
    "tagId": 17
  },
  {
    "createdAt": "2026-06-09T05:25:29.352Z",
    "updatedAt": "2026-06-09T05:25:29.352Z",
    "postId": 7,
    "tagId": 18
  },
  {
    "createdAt": "2026-06-09T05:25:29.382Z",
    "updatedAt": "2026-06-09T05:25:29.382Z",
    "postId": 7,
    "tagId": 19
  },
  {
    "createdAt": "2026-06-09T05:25:29.408Z",
    "updatedAt": "2026-06-09T05:25:29.408Z",
    "postId": 7,
    "tagId": 20
  },
  {
    "createdAt": "2026-06-09T05:26:52.669Z",
    "updatedAt": "2026-06-09T05:26:52.669Z",
    "postId": 8,
    "tagId": 18
  },
  {
    "createdAt": "2026-06-09T05:26:52.649Z",
    "updatedAt": "2026-06-09T05:26:52.649Z",
    "postId": 8,
    "tagId": 21
  },
  {
    "createdAt": "2026-06-09T05:26:52.661Z",
    "updatedAt": "2026-06-09T05:26:52.661Z",
    "postId": 8,
    "tagId": 22
  },
  {
    "createdAt": "2026-06-09T06:20:38.112Z",
    "updatedAt": "2026-06-09T06:20:38.112Z",
    "postId": 9,
    "tagId": 23
  },
  {
    "createdAt": "2026-06-09T06:20:38.124Z",
    "updatedAt": "2026-06-09T06:20:38.124Z",
    "postId": 9,
    "tagId": 24
  },
  {
    "createdAt": "2026-06-09T06:20:38.133Z",
    "updatedAt": "2026-06-09T06:20:38.133Z",
    "postId": 9,
    "tagId": 25
  },
  {
    "createdAt": "2026-06-09T14:22:52.540Z",
    "updatedAt": "2026-06-09T14:22:52.540Z",
    "postId": 10,
    "tagId": 26
  },
  {
    "createdAt": "2026-06-09T14:22:52.557Z",
    "updatedAt": "2026-06-09T14:22:52.557Z",
    "postId": 10,
    "tagId": 27
  },
  {
    "createdAt": "2026-06-09T14:22:52.578Z",
    "updatedAt": "2026-06-09T14:22:52.578Z",
    "postId": 10,
    "tagId": 28
  },
  {
    "createdAt": "2026-06-09T14:27:35.728Z",
    "updatedAt": "2026-06-09T14:27:35.728Z",
    "postId": 11,
    "tagId": 29
  },
  {
    "createdAt": "2026-06-09T14:27:36.330Z",
    "updatedAt": "2026-06-09T14:27:36.330Z",
    "postId": 11,
    "tagId": 30
  },
  {
    "createdAt": "2026-06-09T14:27:36.357Z",
    "updatedAt": "2026-06-09T14:27:36.357Z",
    "postId": 11,
    "tagId": 31
  },
  {
    "createdAt": "2026-06-10T04:37:49.481Z",
    "updatedAt": "2026-06-10T04:37:49.481Z",
    "postId": 12,
    "tagId": 9
  },
  {
    "createdAt": "2026-06-10T04:37:49.460Z",
    "updatedAt": "2026-06-10T04:37:49.460Z",
    "postId": 12,
    "tagId": 15
  },
  {
    "createdAt": "2026-06-10T04:37:49.472Z",
    "updatedAt": "2026-06-10T04:37:49.472Z",
    "postId": 12,
    "tagId": 18
  },
  {
    "createdAt": "2026-06-11T03:22:01.381Z",
    "updatedAt": "2026-06-11T03:22:01.381Z",
    "postId": 13,
    "tagId": 9
  },
  {
    "createdAt": "2026-06-11T03:22:01.367Z",
    "updatedAt": "2026-06-11T03:22:01.367Z",
    "postId": 13,
    "tagId": 32
  },
  {
    "createdAt": "2026-06-11T03:23:10.451Z",
    "updatedAt": "2026-06-11T03:23:10.451Z",
    "postId": 14,
    "tagId": 9
  },
  {
    "createdAt": "2026-06-11T03:23:10.413Z",
    "updatedAt": "2026-06-11T03:23:10.413Z",
    "postId": 14,
    "tagId": 32
  },
  {
    "createdAt": "2026-06-11T03:23:10.437Z",
    "updatedAt": "2026-06-11T03:23:10.437Z",
    "postId": 14,
    "tagId": 33
  }
];

const imageRows = [
  {
    "id": 7,
    "postId": 4,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145035/fotaza/aicbjncpibfmpdhczzky.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "no-copyright",
    "commentsEnabled": false,
    "createdAt": "2026-06-09T03:28:14.158Z",
    "updatedAt": "2026-06-11T01:14:03.818Z"
  },
  {
    "id": 8,
    "postId": 4,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145037/fotaza/zg6j6qc7bsf8twi4g5ls.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "copyright",
    "commentsEnabled": false,
    "createdAt": "2026-06-09T03:28:14.166Z",
    "updatedAt": "2026-06-11T01:14:23.260Z"
  },
  {
    "id": 9,
    "postId": 4,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145012/fotaza/hs21emf2ezj1gkkgbhoh.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T03:28:14.169Z",
    "updatedAt": "2026-06-09T03:28:14.169Z"
  },
  {
    "id": 10,
    "postId": 5,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781148612/frolita_membrillo_pfbe4h.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T04:30:12.567Z",
    "updatedAt": "2026-06-09T04:30:12.567Z"
  },
  {
    "id": 11,
    "postId": 6,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145015/fotaza/t61hxtijtvef4mghmf9a.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T05:07:57.965Z",
    "updatedAt": "2026-06-09T05:07:57.965Z"
  },
  {
    "id": 12,
    "postId": 7,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145017/fotaza/hygpttir0mssszeva5y1.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T05:25:29.229Z",
    "updatedAt": "2026-06-09T05:25:29.229Z"
  },
  {
    "id": 13,
    "postId": 7,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145018/fotaza/q05rkvsvq6za3mjhxrsx.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "no-copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T05:25:29.237Z",
    "updatedAt": "2026-06-09T05:25:29.237Z"
  },
  {
    "id": 14,
    "postId": 8,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145022/fotaza/onrzyzn98jti1beg1ndt.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "no-copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T05:26:52.579Z",
    "updatedAt": "2026-06-09T05:26:52.579Z"
  },
  {
    "id": 15,
    "postId": 9,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145026/fotaza/bfsrqx930flfhv5amfjg.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T06:20:37.925Z",
    "updatedAt": "2026-06-09T06:20:37.925Z"
  },
  {
    "id": 16,
    "postId": 10,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145028/fotaza/klrypjeqnlpssgigylij.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "no-copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T14:22:52.009Z",
    "updatedAt": "2026-06-09T14:22:52.009Z"
  },
  {
    "id": 17,
    "postId": 10,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145029/fotaza/s6djbsr1idbt2gxkqbfw.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T14:22:52.020Z",
    "updatedAt": "2026-06-09T14:22:52.020Z"
  },
  {
    "id": 18,
    "postId": 11,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145033/fotaza/dtaljabh6shmbwhid7rc.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-09T14:27:35.527Z",
    "updatedAt": "2026-06-09T14:27:35.527Z"
  },
  {
    "id": 19,
    "postId": 12,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781145034/fotaza/py9mncnvthzgtrc2z8wt.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "no-copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-10T04:37:49.399Z",
    "updatedAt": "2026-06-10T04:37:49.399Z"
  },
  {
    "id": 20,
    "postId": 13,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781148121/fotaza/qy5mc3puqchup6pwcme2.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "no-copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-11T03:22:01.107Z",
    "updatedAt": "2026-06-11T03:22:01.107Z"
  },
  {
    "id": 21,
    "postId": 14,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781148190/fotaza/pwtb7ullkmdemsc3wsgm.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "no-copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-11T03:23:10.315Z",
    "updatedAt": "2026-06-11T03:23:10.315Z"
  },
  {
    "id": 22,
    "postId": 14,
    "url": "https://res.cloudinary.com/dvmc3ez0v/image/upload/v1781148191/fotaza/auowyhujwqof2xhiz8ax.jpg",
    "thumbnailUrl": null,
    "altText": null,
    "license": "copyright",
    "commentsEnabled": true,
    "createdAt": "2026-06-11T03:23:10.320Z",
    "updatedAt": "2026-06-11T03:23:10.320Z"
  }
];

const commentRows = [
  {
    "id": 2,
    "imageId": 8,
    "userId": 2,
    "content": "esto me parece bien",
    "createdAt": "2026-06-09T03:28:34.359Z",
    "updatedAt": "2026-06-09T03:28:34.359Z"
  },
  {
    "id": 3,
    "imageId": 8,
    "userId": 2,
    "content": "ahora me sigue pareciendo bien pero mejor que antes, con mucha diferencia porque quiero ver que un comentario largo quede bien.",
    "createdAt": "2026-06-09T03:39:20.388Z",
    "updatedAt": "2026-06-09T03:39:20.388Z"
  },
  {
    "id": 4,
    "imageId": 8,
    "userId": 3,
    "content": "Hola a mi también me parece fantástico, soy pepito catalán te voy a seguir muy bueno lo tuyo sos un fenómeno hermano te agradezco mucho",
    "createdAt": "2026-06-09T04:34:00.607Z",
    "updatedAt": "2026-06-09T04:34:00.607Z"
  },
  {
    "id": 5,
    "imageId": 7,
    "userId": 3,
    "content": "Las tortitas son una locura soy pepito catalán",
    "createdAt": "2026-06-09T04:34:53.522Z",
    "updatedAt": "2026-06-09T04:34:53.522Z"
  },
  {
    "id": 6,
    "imageId": 9,
    "userId": 3,
    "content": "Esto no sé que es pero se ve tremendo, seguí así crack",
    "createdAt": "2026-06-09T04:35:20.024Z",
    "updatedAt": "2026-06-09T04:35:20.024Z"
  },
  {
    "id": 7,
    "imageId": 11,
    "userId": 4,
    "content": "muy bueno pepito",
    "createdAt": "2026-06-09T06:17:40.919Z",
    "updatedAt": "2026-06-09T06:17:40.919Z"
  },
  {
    "id": 8,
    "imageId": 14,
    "userId": 2,
    "content": "Me gusta la informática, muy bueno",
    "createdAt": "2026-06-09T13:06:29.761Z",
    "updatedAt": "2026-06-09T13:06:29.761Z"
  },
  {
    "id": 9,
    "imageId": 15,
    "userId": 2,
    "content": "Don Ramón sos lo más grande que hay",
    "createdAt": "2026-06-09T13:23:51.393Z",
    "updatedAt": "2026-06-09T13:23:51.393Z"
  },
  {
    "id": 10,
    "imageId": 16,
    "userId": 6,
    "content": "Me equivoqué, puse dos veces la misma imagen. ya haré otro post",
    "createdAt": "2026-06-09T14:24:05.305Z",
    "updatedAt": "2026-06-09T14:24:05.305Z"
  },
  {
    "id": 11,
    "imageId": 15,
    "userId": 3,
    "content": "Estoy de acuerdo Ron Damon crack",
    "createdAt": "2026-06-10T05:08:44.533Z",
    "updatedAt": "2026-06-10T05:08:44.533Z"
  },
  {
    "id": 12,
    "imageId": 18,
    "userId": 4,
    "content": "gracias goku por salvar el planeta tantas veces, sos un fenómeno",
    "createdAt": "2026-06-11T00:05:18.829Z",
    "updatedAt": "2026-06-11T00:05:18.829Z"
  },
  {
    "id": 13,
    "imageId": 15,
    "userId": 4,
    "content": "Me sumo fuerte al acuerdo, genio",
    "createdAt": "2026-06-11T00:51:07.047Z",
    "updatedAt": "2026-06-11T00:51:07.047Z"
  },
  {
    "id": 14,
    "imageId": 9,
    "userId": 7,
    "content": "vos hacés eso pibe?",
    "createdAt": "2026-06-11T03:24:05.110Z",
    "updatedAt": "2026-06-11T03:24:05.110Z"
  },
  {
    "id": 15,
    "imageId": 22,
    "userId": 2,
    "content": "gracias por tanto doctor",
    "createdAt": "2026-06-11T03:25:14.203Z",
    "updatedAt": "2026-06-11T03:25:14.203Z"
  },
  {
    "id": 16,
    "imageId": 20,
    "userId": 2,
    "content": "que tremenda facha!!",
    "createdAt": "2026-06-11T03:25:42.110Z",
    "updatedAt": "2026-06-11T03:25:42.110Z"
  }
];

const valorationRows = [
  {
    "id": 1,
    "imageId": 11,
    "userId": 2,
    "value": 5,
    "createdAt": "2026-06-09T05:47:54.271Z",
    "updatedAt": "2026-06-09T05:47:54.271Z"
  },
  {
    "id": 2,
    "imageId": 11,
    "userId": 4,
    "value": 4,
    "createdAt": "2026-06-09T06:17:19.994Z",
    "updatedAt": "2026-06-09T06:17:19.994Z"
  },
  {
    "id": 3,
    "imageId": 13,
    "userId": 5,
    "value": 3,
    "createdAt": "2026-06-09T06:20:57.540Z",
    "updatedAt": "2026-06-09T06:20:57.540Z"
  },
  {
    "id": 4,
    "imageId": 12,
    "userId": 5,
    "value": 5,
    "createdAt": "2026-06-09T06:21:04.558Z",
    "updatedAt": "2026-06-09T06:21:04.558Z"
  },
  {
    "id": 5,
    "imageId": 8,
    "userId": 5,
    "value": 4,
    "createdAt": "2026-06-09T06:21:33.011Z",
    "updatedAt": "2026-06-09T06:21:33.011Z"
  },
  {
    "id": 6,
    "imageId": 11,
    "userId": 5,
    "value": 3,
    "createdAt": "2026-06-09T06:21:52.486Z",
    "updatedAt": "2026-06-09T06:21:52.486Z"
  },
  {
    "id": 7,
    "imageId": 10,
    "userId": 5,
    "value": 5,
    "createdAt": "2026-06-09T06:25:50.516Z",
    "updatedAt": "2026-06-09T06:25:50.516Z"
  },
  {
    "id": 8,
    "imageId": 9,
    "userId": 5,
    "value": 3,
    "createdAt": "2026-06-09T06:26:10.725Z",
    "updatedAt": "2026-06-09T06:26:10.725Z"
  },
  {
    "id": 9,
    "imageId": 7,
    "userId": 5,
    "value": 4,
    "createdAt": "2026-06-09T06:26:15.190Z",
    "updatedAt": "2026-06-09T06:26:15.190Z"
  },
  {
    "id": 10,
    "imageId": 14,
    "userId": 2,
    "value": 5,
    "createdAt": "2026-06-09T13:06:19.209Z",
    "updatedAt": "2026-06-09T13:06:19.209Z"
  },
  {
    "id": 11,
    "imageId": 15,
    "userId": 2,
    "value": 5,
    "createdAt": "2026-06-09T13:23:38.553Z",
    "updatedAt": "2026-06-09T13:23:38.553Z"
  },
  {
    "id": 12,
    "imageId": 15,
    "userId": 3,
    "value": 5,
    "createdAt": "2026-06-10T05:08:31.195Z",
    "updatedAt": "2026-06-10T05:08:31.195Z"
  },
  {
    "id": 13,
    "imageId": 18,
    "userId": 4,
    "value": 5,
    "createdAt": "2026-06-11T00:04:44.170Z",
    "updatedAt": "2026-06-11T00:04:44.170Z"
  },
  {
    "id": 14,
    "imageId": 10,
    "userId": 4,
    "value": 5,
    "createdAt": "2026-06-11T00:07:03.469Z",
    "updatedAt": "2026-06-11T00:07:03.469Z"
  },
  {
    "id": 15,
    "imageId": 18,
    "userId": 2,
    "value": 3,
    "createdAt": "2026-06-11T00:07:35.792Z",
    "updatedAt": "2026-06-11T00:07:35.792Z"
  },
  {
    "id": 16,
    "imageId": 13,
    "userId": 2,
    "value": 1,
    "createdAt": "2026-06-11T00:08:10.884Z",
    "updatedAt": "2026-06-11T00:08:10.884Z"
  },
  {
    "id": 17,
    "imageId": 12,
    "userId": 2,
    "value": 2,
    "createdAt": "2026-06-11T00:08:15.230Z",
    "updatedAt": "2026-06-11T00:08:15.230Z"
  },
  {
    "id": 18,
    "imageId": 12,
    "userId": 3,
    "value": 2,
    "createdAt": "2026-06-11T00:47:41.752Z",
    "updatedAt": "2026-06-11T00:47:41.752Z"
  },
  {
    "id": 19,
    "imageId": 13,
    "userId": 3,
    "value": 1,
    "createdAt": "2026-06-11T00:47:44.096Z",
    "updatedAt": "2026-06-11T00:47:44.096Z"
  },
  {
    "id": 20,
    "imageId": 18,
    "userId": 3,
    "value": 5,
    "createdAt": "2026-06-11T00:48:07.945Z",
    "updatedAt": "2026-06-11T00:48:07.945Z"
  },
  {
    "id": 21,
    "imageId": 17,
    "userId": 3,
    "value": 2,
    "createdAt": "2026-06-11T00:48:22.285Z",
    "updatedAt": "2026-06-11T00:48:22.285Z"
  },
  {
    "id": 22,
    "imageId": 16,
    "userId": 3,
    "value": 1,
    "createdAt": "2026-06-11T00:48:27.452Z",
    "updatedAt": "2026-06-11T00:48:27.452Z"
  },
  {
    "id": 23,
    "imageId": 10,
    "userId": 3,
    "value": 1,
    "createdAt": "2026-06-11T00:49:42.599Z",
    "updatedAt": "2026-06-11T00:49:42.599Z"
  },
  {
    "id": 24,
    "imageId": 15,
    "userId": 4,
    "value": 5,
    "createdAt": "2026-06-11T00:50:11.839Z",
    "updatedAt": "2026-06-11T00:50:11.839Z"
  },
  {
    "id": 25,
    "imageId": 8,
    "userId": 4,
    "value": 3,
    "createdAt": "2026-06-11T01:08:48.136Z",
    "updatedAt": "2026-06-11T01:08:48.136Z"
  },
  {
    "id": 26,
    "imageId": 8,
    "userId": 7,
    "value": 3,
    "createdAt": "2026-06-11T03:23:39.888Z",
    "updatedAt": "2026-06-11T03:23:39.888Z"
  },
  {
    "id": 27,
    "imageId": 7,
    "userId": 7,
    "value": 4,
    "createdAt": "2026-06-11T03:23:46.543Z",
    "updatedAt": "2026-06-11T03:23:46.543Z"
  },
  {
    "id": 28,
    "imageId": 21,
    "userId": 2,
    "value": 5,
    "createdAt": "2026-06-11T03:24:29.915Z",
    "updatedAt": "2026-06-11T03:24:29.915Z"
  },
  {
    "id": 29,
    "imageId": 22,
    "userId": 2,
    "value": 5,
    "createdAt": "2026-06-11T03:24:42.760Z",
    "updatedAt": "2026-06-11T03:24:42.760Z"
  },
  {
    "id": 30,
    "imageId": 20,
    "userId": 2,
    "value": 5,
    "createdAt": "2026-06-11T03:25:25.574Z",
    "updatedAt": "2026-06-11T03:25:25.574Z"
  },
  {
    "id": 31,
    "imageId": 15,
    "userId": 7,
    "value": 5,
    "createdAt": "2026-06-11T03:32:27.113Z",
    "updatedAt": "2026-06-11T03:32:27.113Z"
  },
  {
    "id": 32,
    "imageId": 9,
    "userId": 7,
    "value": 2,
    "createdAt": "2026-06-11T03:50:10.065Z",
    "updatedAt": "2026-06-11T03:50:10.065Z"
  }
];

const interestRows = [
  {
    "id": 6,
    "imageId": 18,
    "userId": 2,
    "activo": false,
    "createdAt": "2026-06-10T23:20:06.268Z",
    "updatedAt": "2026-06-10T23:37:45.282Z"
  },
  {
    "id": 7,
    "imageId": 15,
    "userId": 3,
    "activo": true,
    "createdAt": "2026-06-10T23:22:22.300Z",
    "updatedAt": "2026-06-10T23:22:22.300Z"
  },
  {
    "id": 10,
    "imageId": 12,
    "userId": 3,
    "activo": true,
    "createdAt": "2026-06-10T23:24:37.328Z",
    "updatedAt": "2026-06-10T23:24:37.328Z"
  },
  {
    "id": 11,
    "imageId": 14,
    "userId": 2,
    "activo": true,
    "createdAt": "2026-06-10T23:31:51.596Z",
    "updatedAt": "2026-06-10T23:32:10.766Z"
  },
  {
    "id": 12,
    "imageId": 18,
    "userId": 4,
    "activo": true,
    "createdAt": "2026-06-11T00:04:40.202Z",
    "updatedAt": "2026-06-11T00:04:40.202Z"
  },
  {
    "id": 13,
    "imageId": 10,
    "userId": 4,
    "activo": true,
    "createdAt": "2026-06-11T00:07:00.968Z",
    "updatedAt": "2026-06-11T00:07:00.968Z"
  },
  {
    "id": 14,
    "imageId": 8,
    "userId": 7,
    "activo": true,
    "createdAt": "2026-06-11T03:23:36.816Z",
    "updatedAt": "2026-06-11T03:23:36.816Z"
  },
  {
    "id": 15,
    "imageId": 21,
    "userId": 2,
    "activo": true,
    "createdAt": "2026-06-11T03:24:32.142Z",
    "updatedAt": "2026-06-11T03:24:32.142Z"
  },
  {
    "id": 16,
    "imageId": 22,
    "userId": 2,
    "activo": true,
    "createdAt": "2026-06-11T03:24:44.977Z",
    "updatedAt": "2026-06-11T03:24:44.977Z"
  },
  {
    "id": 17,
    "imageId": 15,
    "userId": 7,
    "activo": true,
    "createdAt": "2026-06-11T03:36:29.933Z",
    "updatedAt": "2026-06-11T03:36:29.933Z"
  }
];

const followRows = [
  {
    "id": 2,
    "followerId": 2,
    "followedId": 5,
    "createdAt": "2026-06-09T13:24:00.077Z",
    "updatedAt": "2026-06-09T13:24:00.077Z"
  },
  {
    "id": 5,
    "followerId": 2,
    "followedId": 4,
    "createdAt": "2026-06-09T13:54:35.159Z",
    "updatedAt": "2026-06-09T13:54:35.159Z"
  },
  {
    "id": 6,
    "followerId": 3,
    "followedId": 2,
    "createdAt": "2026-06-09T14:09:26.849Z",
    "updatedAt": "2026-06-09T14:09:26.849Z"
  },
  {
    "id": 7,
    "followerId": 6,
    "followedId": 4,
    "createdAt": "2026-06-09T14:28:30.400Z",
    "updatedAt": "2026-06-09T14:28:30.400Z"
  },
  {
    "id": 8,
    "followerId": 6,
    "followedId": 3,
    "createdAt": "2026-06-09T14:28:37.815Z",
    "updatedAt": "2026-06-09T14:28:37.815Z"
  },
  {
    "id": 9,
    "followerId": 6,
    "followedId": 2,
    "createdAt": "2026-06-09T14:28:43.210Z",
    "updatedAt": "2026-06-09T14:28:43.210Z"
  },
  {
    "id": 10,
    "followerId": 5,
    "followedId": 6,
    "createdAt": "2026-06-10T05:06:55.525Z",
    "updatedAt": "2026-06-10T05:06:55.525Z"
  },
  {
    "id": 11,
    "followerId": 3,
    "followedId": 5,
    "createdAt": "2026-06-10T05:08:24.914Z",
    "updatedAt": "2026-06-10T05:08:24.914Z"
  },
  {
    "id": 12,
    "followerId": 3,
    "followedId": 4,
    "createdAt": "2026-06-10T23:23:11.213Z",
    "updatedAt": "2026-06-10T23:23:11.213Z"
  },
  {
    "id": 13,
    "followerId": 4,
    "followedId": 6,
    "createdAt": "2026-06-11T00:04:37.041Z",
    "updatedAt": "2026-06-11T00:04:37.041Z"
  },
  {
    "id": 14,
    "followerId": 4,
    "followedId": 2,
    "createdAt": "2026-06-11T00:06:33.856Z",
    "updatedAt": "2026-06-11T00:06:33.856Z"
  },
  {
    "id": 15,
    "followerId": 3,
    "followedId": 6,
    "createdAt": "2026-06-11T00:48:15.460Z",
    "updatedAt": "2026-06-11T00:48:15.460Z"
  },
  {
    "id": 17,
    "followerId": 2,
    "followedId": 6,
    "createdAt": "2026-06-11T01:19:09.961Z",
    "updatedAt": "2026-06-11T01:19:09.961Z"
  },
  {
    "id": 18,
    "followerId": 2,
    "followedId": 7,
    "createdAt": "2026-06-11T03:24:35.108Z",
    "updatedAt": "2026-06-11T03:24:35.108Z"
  },
  {
    "id": 19,
    "followerId": 7,
    "followedId": 5,
    "createdAt": "2026-06-11T03:36:19.799Z",
    "updatedAt": "2026-06-11T03:36:19.799Z"
  },
  {
    "id": 22,
    "followerId": 7,
    "followedId": 2,
    "createdAt": "2026-06-11T03:50:01.937Z",
    "updatedAt": "2026-06-11T03:50:01.937Z"
  }
];

async function seed() {
  initializeAssociations();
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userRows.map(({ id, ...rest }) => ({ ...rest })));
  const userIdMap = Object.fromEntries(userRows.map((r, i) => [r.id, users[i].id]));

  const tags = await Tag.bulkCreate(tagRows.map(({ id, ...rest }) => ({ ...rest })));
  const tagIdMap = Object.fromEntries(tagRows.map((r, i) => [r.id, tags[i].id]));

  const posts = await Post.bulkCreate(postRows.map(({ id, ...rest }) => ({
    ...rest,
    userId: userIdMap[rest.userId],
  })));
  const postIdMap = Object.fromEntries(postRows.map((r, i) => [r.id, posts[i].id]));

  if (postTagRows.length > 0) {
    const PostTag = sequelize.models.PostTag;
    await PostTag.bulkCreate(postTagRows.map(({ id, ...rest }) => ({
      ...rest,
      postId: postIdMap[rest.postId],
      tagId: tagIdMap[rest.tagId],
    })));
  }

  const images = await Image.bulkCreate(imageRows.map(({ id, ...rest }) => ({
    ...rest,
    postId: postIdMap[rest.postId],
  })));
  const imageIdMap = Object.fromEntries(imageRows.map((r, i) => [r.id, images[i].id]));

  if (commentRows.length > 0) {
    await Comment.bulkCreate(commentRows.map(({ id, ...rest }) => ({
      ...rest,
      imageId: imageIdMap[rest.imageId],
      userId: userIdMap[rest.userId],
    })));
  }

  if (valorationRows.length > 0) {
    await Valoration.bulkCreate(valorationRows.map(({ id, ...rest }) => ({
      ...rest,
      imageId: imageIdMap[rest.imageId],
      userId: userIdMap[rest.userId],
    })));
  }

  if (interestRows.length > 0) {
    await Interest.bulkCreate(interestRows.map(({ id, ...rest }) => ({
      ...rest,
      imageId: imageIdMap[rest.imageId],
      userId: userIdMap[rest.userId],
    })));
  }

  if (followRows.length > 0) {
    await Follow.bulkCreate(followRows.map(({ id, ...rest }) => ({
      ...rest,
      followerId: userIdMap[rest.followerId],
      followedId: userIdMap[rest.followedId],
    })));
  }

  for (const userId of Object.values(userIdMap)) {
    await Collection.create({ userId, name: 'Favoritos', isDefault: true });
  }

  console.log('[+] Seed completado.');
  await sequelize.close();
}

seed();
