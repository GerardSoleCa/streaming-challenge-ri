'use strict';
const chai = require('chai');
const CryptoBox = require('./cryptoBox');
const expect = chai.expect;

const key = 'passphrase';
const plainText = 'the quick brown fox jumps over the lazy dog';

describe('CryptoBox test', () => {
    describe('"AES-256-CBC"', () => {

        let cryptoBox = new CryptoBox('aes-256-cbc', key);
        const cipherText = '/KPnxeEXs9H25EZfKUiGUER7HSfsVzqb6qC/Da6/vzkK5tNdylme68ydmNfhXEUe';

        it('encrypt plain text should match with cipher text', () => {
            expect(cryptoBox.encrypt(plainText)).to.equal(cipherText);
        });

        it('cipher text should match', () => {
            expect(cryptoBox.decrypt(cipherText)).to.equal(plainText);
        });

    });

    describe('"DES-EDE3-CBC"', () => {

        let cryptoBox = new CryptoBox('des-ede3-cbc', key);
        const cipherText = 'K0oAdQe4mT5a0CcIPyQoMr1gIPP8RnKENa5S811IjZ4u+ddtuEcJfcX2LD4DV+y0';

        it('encrypt plain text should match with cipher text', () => {
            expect(cryptoBox.encrypt(plainText)).to.equal(cipherText);
        });

        it('cipher text should match', () => {
            expect(cryptoBox.decrypt(cipherText)).to.equal(plainText);
        });

    });

});