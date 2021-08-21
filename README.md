# SERVICE MARKET
## #P2PC

SERVICE-MARKET creates a fair-ground for service producers and consumers who employ intermediaries to engage with each other in a reccuring fasion. SERVICE-MARKET is based on MARI payment protocol which is a unidirectional off-chain micropayment protocol. 

## Features
- Publicize service details of producers and intermediary services.
- Consumers can browse and connect with multiple products as packages.
- Compensation is,
-- through intermediary.
-- infinetely granualar.
-- off the blockchain, thus saves transaction fees.

##### The Issue
Intermediary assists in managerial tasks, including access management, communication, and quality of service between producers and consumers in a service environment. It is advantageous for resource-constrained producers (e.g. IoTs) to minimize the cost and managerial overhead on them. Instead they can focus more on their core production. Further, intermediaries are capable of handling a large number of similar pairs seamlessly which lead to high scalability of the application. However, intermediaries are not always the preferred choice as they can conceal the views of both producer and consumer in terms of service and pricing. When payments are made to producers through intermediaries, it can incur a higher price for consumers compared to the actual fee of the producer. Pros and cons indicate the value of intermediary and on the other hand, the great power, held by them. 

##### MARI

MARI allows the process of consumers paying producers through intemediaries. However, the payment process is controlled by the producer with minimum overhead on producer.

More info: Towards Micropayment for Intermediary based Trading

Anupa De Silva, Subhasis Thakur & John Breslin. Towards Micropayment for Intermediary based Trading.  Lecture Notes in Networks and Systems: Vol. 320. BLOCKCHAIN 2021 (pp. 1–11). Springer. https://doi.org/10.1007/978-3-030-86162-9_22

##### How It Works

1. Initially intermediary services and producer services are published with details of fee structures and service details.
2. Producers pick intermediaries for their services and creat a service contract.
3. Consumers picks one or more services and request for services.
4. Once approved they can proceed with contract creation.According to MARI, a Layered Merkel Tree Lock is created and published on chain.
5. Thereafter, payment can be done offline providng signature of consumer.
6. At the end of the service intermediaries can claim the values. 

##### Tech

SERVICE-MARKET uses several opensource technologies. 
- [React](reactjs.org) - Frontend development
- [Web3](web3js.readthedocs.io) - Ethereum Interfacing Library
- [Truffle](www.trufflesuite.com) - Ethereum Development Environment
- [Ethereum](ethereum.org) - Blockchain
- [Solidity](docs.soliditylang.org) - Smart Contract Language
- [Firebase](firebase.google.com) - Realtime database and API

##### Installation

Install the dependencies and devDependencies and start the server.

```sh
npm install
npm start
```

Envrionment Variables

```sh
REACT_APP_API_KEY=<your_react_api_key>
REACT_APP_AUTH_DOMAIN=<firebase_domain>
REACT_APP_PROJECT_ID=<firebase_project_id>
REACT_APP_STORAGE_BUCKET=<firebase_storage>
REACT_APP_MESSAGING_SENDER_ID=<firebase_message_sender_id>
REACT_APP_CONFIRMATION_EMAIL_REDIRECT=<email_redirection_url>

W3_HOST=<web3_host>
W3_PORT=<web3_port>
```


## License
MIT
