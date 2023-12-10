#!/bin/bash
cd ./cosmjs; echo -ne '\n' | yarn publish; cd ..
cd ./ethersjs/v5; echo -ne '\n' | yarn publish; cd ../..
cd ./ethersjs/v6; echo -ne '\n' | yarn publish; cd ../..
cd ./viem; echo -ne '\n' | yarn publish; cd ..
cd ./web3js; echo -ne '\n' | yarn publish; cd ..