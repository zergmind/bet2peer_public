// import PropTypes from "prop-types";
// import Bet from "../models/bet";

// import { WebSockets } from "libp2p/websockets";
// import { createLibp2p } from "libp2p";
// import { Noise } from "@chainsafe/libp2p-noise";
// import { Mplex } from "@libp2p/mplex";

// export class P2PService {
//   account;
//   p2p;
//   constructor(account) {
//     this.account = account;
//     this.create();
//   }
//   showAccount() {
//     alert(this.account);
//   }

//   async create() {
//     this.p2p = await createLibp2p({
//       addresses: {
//         // add a listen address (localhost) to accept TCP connections on a random port
//         listen: ["/ip4/127.0.0.1/tcp/0"],
//       },
//       transports: [new WebSockets()],
//       connectionEncryption: [new Noise()],
//       streamMuxers: [new Mplex()],
//     });
//   }

//   async start() {
//     await this.p2p.start();
//     console.log("libp2p has started");
//   }
// }
