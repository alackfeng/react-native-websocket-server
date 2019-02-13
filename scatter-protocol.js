


/** 
 * request: 
 * response: 42/scatter,["api",{"id":"129828211333125165148183204994522381088021410210525020013023344","result": true}]
 */
const responseResult = (id, result) => ('42/scatter,' + JSON.stringify(["api",{"id": id, "result": result}]));


/** 
 * request: connectConnected | connectRekey | connectPaired
 * response: 
 * '42/scatter,["connected"]
 * '42/scatter,["rekey"]
 * '42/scatter,["paired",true]
 */
export const connectConnected = () => ('42/scatter,' + JSON.stringify(['connected']));
export const connectRekey = () => ('42/scatter,' + JSON.stringify(['rekey']));
export const connectPaired = (paired) => ('42/scatter,' + JSON.stringify(['paired', paired || false]));


/** 
 * request: getVersion
 * response: 42/scatter,["api",{"id":"129828211333125165148183204994522381088021410210525020013023344","result":"10.1.2"}]
 */
const scatterVersion = "10.1.0";
export const getVersion = (id) => responseResult(id, scatterVersion);

/*
request: identityFromPermissions | getOrRequestIdentity
reponse:
[
  "api",
  {
    "id": "1541992211131891564222017190227485785122234108252193239231123200102",
    "result": {
      "hash": "2f6c45d4f67354c8a4896f04b0651ceafa08b2c86658b54a0fc095f9662691f1",
      "publicKey": "EOS8S3tdsSeTyCe2NBgkKcHgv9KYw2xVwLFDGxH1ebVhLwMnGkDxY",
      "name": "MyFirstIdentity",
      "kyc": false,
      "accounts": [
        {
          "name": "coinfid55555",
          "authority": "active",
          "publicKey": "EOS7cZMPEEo3EMHWkRJ7zHv3dQNvZDUHi71tHitNPqht8zwppdFXZ",
          "blockchain": "eos",
          "chainId": "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
          "isHardware": false
        }
      ]
    }
  }
]
*/

const idDefault = "1";
const publicKeyDefault = "EOS8S3tdsSeTyCe2NBgkKcHgv9KYw2xVwLFDGxH1ebVhLwMnGkDxY";

export const getOrRequestIdentity = (id, publicKey, accounts) => identityFromPermissions(id, publicKey, accounts);
export const identityFromPermissions = (id, publicKey, accounts) => {
  
  return '42/scatter,' + JSON.stringify([
    "api",
    {
      "id": id || idDefault,
      "result": {
        "hash": "2f6c45d4f67354c8a4896f04b0651ceafa08b2c86658b54a0fc095f9662691f1",
        "publicKey": publicKey || publicKeyDefault,
        "name": "MyFirstIdentity",
        "kyc": false,
        "accounts": [
          {
            "name": "coinfid55555",
            "authority": "active",
            "publicKey": "EOS7cZMPEEo3EMHWkRJ7zHv3dQNvZDUHi71tHitNPqht8zwppdFXZ",
            "blockchain": "eos",
            "chainId": "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
            "isHardware": false
          }
        ]
      }
    }
  ]);
}

/**
 * request: forgetIdentity
 * response: 42/scatter,["api",{"id":"13394185987921327127213255132144105717327159158223190205225195166","result":true}]
 */
export const forgetIdentity = (id) => responseResult(id, true);

/**
 * request: requestAddNetwork
 * response: 42/scatter,["api",{"id":"13394185987921327127213255132144105717327159158223190205225195166","result":true}]
 */
export const requestAddNetwork = (id, added) => responseResult(id, added);

/**
 * request: getPublicKey
 * response: 
  [
    "api",
    {
      "id": "292347240106194137402157913217711441772291261462455321267120",
      "result": "EOS5zwpo5uNUGsjbGHDM7vGJstgo357WDhn5cL1CxXtDWpLHEetce"
    }
  ] 
*/
export const getPublicKey = (id, publicKey) => responseResult(id, publicKey);

/**
 * request: linkAccount
 * response: 42/scatter,["api",{"id":"13394185987921327127213255132144105717327159158223190205225195166","result":true}]
*/
export const linkAccount = (id) => responseResult(id, true);

/**
 * request: requestArbitrarySignature
 * response: 42/scatter,["api",{"id":"252642074423518120919877238852421141311510524716818123493243856","result":"SIG_K1_KUtE54b88SQppgSGvyQM44ejjXyY6HjJM7i1uEDGFJU4WyJTCEht4bMW79Nw9jiEpXyeMnqruWnWcp2bnuEwCoDzkTv4Dg"}]

*/
export const requestArbitrarySignature = (id, signed) => responseResult(id, signed);

/**
 * request: requestTransfer
 * response: 
42/scatter,["api",{"id":"197219128145249224175184942056966173391481461156861146253212195158","result":{"broadcast":true,"transaction":{"compression":"none","transaction":{"expiration":"2019-02-11T07:13:40","ref_block_num":37666,"ref_block_prefix":3487995166,"max_net_usage_words":0,"max_cpu_usage_ms":0,"delay_sec":0,"context_free_actions":[],"actions":[{"account":"eosio.token","name":"transfer","authorization":[{"actor":"coinfid55555","permission":"active"}],"data":"504a2925b9351d453044a0b96a9c4de3010000000000000004454f530000000000"}],"transaction_extensions":[]},"signatures":["SIG_K1_KA4BnexkQXaAfkHYGYppt7kRhsaeS4JjFTxnFxZhTXXbmu2WWebS8P9uhL7SZUVsXyDE6tUZB2En4JSXJjPzLQVzH4QZiV"]},"transaction_id":"1537c72aa97780003420630169fa305bca1785f6440cd99b35c9c86a9ead7113","processed":{"id":"1537c72aa97780003420630169fa305bca1785f6440cd99b35c9c86a9ead7113","block_num":42177656,"block_time":"2019-02-11T07:12:44.500","producer_block_id":null,"receipt":{"status":"executed","cpu_usage_us":297,"net_usage_words":16},"elapsed":297,"net_usage":128,"scheduled":false,"action_traces":[{"receipt":{"receiver":"eosio.token","act_digest":"5fa181a78ea9974d779e77c9e29bcd6038b004325daf01c3eef32c1b3b2c50ad","global_sequence":"4947401029","recv_sequence":813803224,"auth_sequence":[["coinfid55555",130]],"code_sequence":2,"abi_sequence":2},"act":{"account":"eosio.token","name":"transfer","authorization":[{"actor":"coinfid55555","permission":"active"}],"data":{"from":"coinfid55555","to":"whatsupto123","quantity":"0.0001 EOS","memo":""},"hex_data":"504a2925b9351d453044a0b96a9c4de3010000000000000004454f530000000000"},"context_free":false,"elapsed":109,"console":"","trx_id":"1537c72aa97780003420630169fa305bca1785f6440cd99b35c9c86a9ead7113","block_num":42177656,"block_time":"2019-02-11T07:12:44.500","producer_block_id":null,"account_ram_deltas":[],"except":null,"inline_traces":[{"receipt":{"receiver":"coinfid55555","act_digest":"5fa181a78ea9974d779e77c9e29bcd6038b004325daf01c3eef32c1b3b2c50ad","global_sequence":"4947401030","recv_sequence":175,"auth_sequence":[["coinfid55555",131]],"code_sequence":2,"abi_sequence":2},"act":{"account":"eosio.token","name":"transfer","authorization":[{"actor":"coinfid55555","permission":"active"}],"data":{"from":"coinfid55555","to":"whatsupto123","quantity":"0.0001 EOS","memo":""},"hex_data":"504a2925b9351d453044a0b96a9c4de3010000000000000004454f530000000000"},"context_free":false,"elapsed":3,"console":"","trx_id":"1537c72aa97780003420630169fa305bca1785f6440cd99b35c9c86a9ead7113","block_num":42177656,"block_time":"2019-02-11T07:12:44.500","producer_block_id":null,"account_ram_deltas":[],"except":null,"inline_traces":[]},{"receipt":{"receiver":"whatsupto123","act_digest":"5fa181a78ea9974d779e77c9e29bcd6038b004325daf01c3eef32c1b3b2c50ad","global_sequence":"4947401031","recv_sequence":19,"auth_sequence":[["coinfid55555",132]],"code_sequence":2,"abi_sequence":2},"act":{"account":"eosio.token","name":"transfer","authorization":[{"actor":"coinfid55555","permission":"active"}],"data":{"from":"coinfid55555","to":"whatsupto123","quantity":"0.0001 EOS","memo":""},"hex_data":"504a2925b9351d453044a0b96a9c4de3010000000000000004454f530000000000"},"context_free":false,"elapsed":5,"console":"","trx_id":"1537c72aa97780003420630169fa305bca1785f6440cd99b35c9c86a9ead7113","block_num":42177656,"block_time":"2019-02-11T07:12:44.500","producer_block_id":null,"account_ram_deltas":[],"except":null,"inline_traces":[]}]}],"except":null}}}]
*/
export const requestTransfer = (id, result) => responseResult(id, result);





