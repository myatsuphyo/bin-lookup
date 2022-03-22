# PCI BIN Numbers Look-up Project

This project reads BIN numbers in a file located at the inputted filepath and creates a report including data about those BIN numbers and an errors report. It is required to purchase API key on https://www.bindb.com. 

The aim is to be useful for the transition of BIN migration from 6-digits to 8-digits. Here is a good article about preparing for 8-digits BINs. 

https://medium.com/m2p-yap-fintech/the-bin-migration-preparing-for-8-digit-bins-642ebbcc56e0

## Requirements
* API key pruchased on https://www.bindb.com
* Node v10 or above, NPM

## How to use
* Install packages locally using npm or yarn after cloning: 
```
$ cd ../bin-lookup
$ npm install or yarn install

```
* Create .env file and declare env variables. Please, check .env.example for required variables.

* Run ``` npm run start ```

* In terminal, "Reading BIN: <bin number>"  and "Writing at <file path>" logs are outputted. 

* After the program is run successfully, report and errors files can be found under inputted <file path>.

### Memory-wise improvement

* Using stream to read and write files 