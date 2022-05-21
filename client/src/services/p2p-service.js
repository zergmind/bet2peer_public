import PropTypes from "prop-types";
import Bet from "../models/bet";

import { TCP } from "libp2p/tcp";
import { createLibp2p } from "libp2p";
// import { NOISE } from "libp2p-noise";
// import { MPLEX } from "libp2p-mplex";

export class P2PService {
  account;
  p2p;
  constructor(account) {
    this.account = account;
    cd;
    this.create();
  }
  showAccount() {
    alert(this.account);
  }

  async create() {
    this.p2p = await createLibp2p({
      modules: {
        transport: [TCP],
        // connEncryption: [NOISE],
        // streamMuxer: [MPLEX],
      },
    });
  }
}
