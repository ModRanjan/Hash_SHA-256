
// /**
//  * Generates SHA-256 hash of string.
//  *
//  * @param   {string} msg - (Unicode) string to be hashed.
//  * @param   {Object} [options]
//  * @param   {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
//  *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('616263' ≡ 'abc') .
//  * @param   {string} [options.outFormat=hex] - Output format: 'hex' for string of contiguous
//  *   hex bytes; 'hex-w' for grouping hex bytes into groups of (4 byte / 8 character) words.
//  * @returns {string} Hash of msg as hex character string.
//  *
//  * @example
//  *   import Sha256 from './sha256.js';
//  *   const hash = Sha256.hash('abc'); // 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
//  */
// class Sha256 {

//     static hash(msg, options) {
//         const defaults = { msgFormat: 'string', outFormat: 'hex' };
//         const opt = Object.assign(defaults, options);

//         // note use throughout this routine of 'n >>> 0' to coerce Number 'n' to unsigned 32-bit integer

//         switch (opt.msgFormat) {
//             default: // default is to convert string to UTF-8, as SHA only deals with byte-streams
//             case 'string': msg = utf8Encode(msg); break;
//             case 'hex-bytes': msg = hexBytesToString(msg); break; // mostly for running tests
//         }

//         // constants
//         const K = [
//             0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
//             0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
//             0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
//             0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
//             0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
//             0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
//             0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
//             0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

//         // initial hash value
//         const H = [
//             0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

//         // PREPROCESSING
//         msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string

//         // convert string msg into 512-bit blocks (array of 16 32-bit integers)
//         const l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
//         console.log(l)
//         const N = Math.ceil(l / 16);  // number of 16-integer (512-bit) blocks required to hold 'l' ints
//         const M = new Array(N);     // message M is N×16 array of 32-bit integers

//         for (let i = 0; i < N; i++) {
//             M[i] = new Array(16);
//             for (let j = 0; j < 16; j++) { // encode 4 chars per integer (64 per block), big-endian encoding
//                 M[i][j] = (msg.charCodeAt(i * 64 + j * 4 + 0) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16)
//                     | (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3) << 0);
//             } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
//         }
//         console.log(M)
//         // add length (in bits) into final pair of 32-bit integers (big-endian) 
//         // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
//         // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
//         const lenHi = ((msg.length - 1) * 8) / Math.pow(2, 32);
//         const lenLo = ((msg.length - 1) * 8) >>> 0;
//         M[N - 1][14] = Math.floor(lenHi);
//         M[N - 1][15] = lenLo;

//         // HASH COMPUTATION 
//         for (let i = 0; i < N; i++) {
//             const W = new Array(64);

//             // 1 - prepare message schedule 'W'
//             for (let t = 0; t < 16; t++) W[t] = M[i][t];
//             for (let t = 16; t < 64; t++) {
//                 W[t] = (Sha256.σ1(W[t - 2]) + W[t - 7] + Sha256.σ0(W[t - 15]) + W[t - 16]) >>> 0;
//             }

//             // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
//             let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

//             // 3 - main loop (note '>>> 0' for 'addition modulo 2^32')
//             for (let t = 0; t < 64; t++) {
//                 const T1 = h + Sha256.Σ1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
//                 const T2 = Sha256.Σ0(a) + Sha256.Maj(a, b, c);
//                 h = g;
//                 g = f;
//                 f = e;
//                 e = (d + T1) >>> 0;
//                 d = c;
//                 c = b;
//                 b = a;
//                 a = (T1 + T2) >>> 0;
//             }

//             // 4 - compute the new intermediate hash value (note '>>> 0' for 'addition modulo 2^32')
//             H[0] = (H[0] + a) >>> 0;
//             H[1] = (H[1] + b) >>> 0;
//             H[2] = (H[2] + c) >>> 0;
//             H[3] = (H[3] + d) >>> 0;
//             H[4] = (H[4] + e) >>> 0;
//             H[5] = (H[5] + f) >>> 0;
//             H[6] = (H[6] + g) >>> 0;
//             H[7] = (H[7] + h) >>> 0;
//         }

//         // convert H0..H7 to hex strings (with leading zeros)
//         for (let h = 0; h < H.length; h++) H[h] = ('00000000' + H[h].toString(16)).slice(-8);

//         // concatenate H0..H7, with separator if required
//         const separator = opt.outFormat == 'hex-w' ? ' ' : '';

//         console.log(H.join(separator))
//         return H.join(separator);

//         /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

//         function utf8Encode(str) {
//             try {
//                 return new TextEncoder().encode(str, 'utf-8').reduce((prev, curr) => prev + String.fromCharCode(curr), '');
//             } catch (e) { // no TextEncoder available?
//                 return unescape(encodeURIComponent(str));
//             }
//         }

//         function hexBytesToString(hexStr) { // convert string of hex numbers to a string of chars (eg '616263' -> 'abc').
//             const str = hexStr.replace(' ', ''); // allow space-separated groups
//             return str == '' ? '' : str.match(/.{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
//         }
//     }

//     /**
//      * Rotates right (circular right shift) value x by n positions 
//      * @private
//      */
//     static ROTR(n, x) {
//         return (x >>> n) | (x << (32 - n));
//     }


//     /**
//      * Logical functions.
//      * @private
//      */
//     static Σ0(x) { return Sha256.ROTR(2, x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); }
//     static Σ1(x) { return Sha256.ROTR(6, x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); }
//     static σ0(x) { return Sha256.ROTR(7, x) ^ Sha256.ROTR(18, x) ^ (x >>> 3); }
//     static σ1(x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x >>> 10); }
//     static Ch(x, y, z) { return (x & y) ^ (~x & z); }          // 'choice'
//     static Maj(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); } // 'majority'

// }

// /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
// function calcHash() {
//     let getStringMessage = document.getElementById("ti1").value;
    
//     // let utf = Sha256.utf8Encode(getStringMessage);
//     // console.log(utf)
//     Sha256.hash(getStringMessage);
    
// }

  



var sha256 = function sha256(ascii) {
	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};
	
	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j; // Used as a counter across the whole file
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;
	
	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the undefinedworking hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			var w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
			
			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
};
