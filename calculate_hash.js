
function calculateHash() {
    var inputMessage = document.getElementById("ti1").value;

    let getMessage = getMessageBlocks(inputMessage);

    // todo: Initialize Hash Values (h)
    let H = [
        "01101010000010011110011001100111", "10111011011001111010111010000101",
        "00111100011011101111001101110010", "10100101010011111111010100111010",
        "01010001000011100101001001111111", "10011011000001010110100010001100",
        "00011111100000111101100110101011", "01011011111000001100110100011001",
    ];

    // todo: Initialize Round Constants (k)
    const K = [
        "01000010100010100010111110011000", "01110001001101110100010010010001",
        "10110101110000001111101111001111", "11101001101101011101101110100101",
        "00111001010101101100001001011011", "01011001111100010001000111110001",
        "10010010001111111000001010100100", "10101011000111000101111011010101",
        "11011000000001111010101010011000", "00010010100000110101101100000001",
        "00100100001100011000010110111110", "01010101000011000111110111000011",
        "01110010101111100101110101110100", "10000000110111101011000111111110",
        "10011011110111000000011010100111", "11000001100110111111000101110100",
        "11100100100110110110100111000001", "11101111101111100100011110000110",
        "00001111110000011001110111000110", "00100100000011001010000111001100",
        "00101101111010010010110001101111", "01001010011101001000010010101010",
        "01011100101100001010100111011100", "01110110111110011000100011011010",
        "10011000001111100101000101010010", "10101000001100011100011001101101",
        "10110000000000110010011111001000", "10111111010110010111111111000111",
        "11000110111000000000101111110011", "11010101101001111001000101000111",
        "00000110110010100110001101010001", "00010100001010010010100101100111",
        "00100111101101110000101010000101", "00101110000110110010000100111000",
        "01001101001011000110110111111100", "01010011001110000000110100010011",
        "01100101000010100111001101010100", "01110110011010100000101010111011",
        "10000001110000101100100100101110", "10010010011100100010110010000101",
        "10100010101111111110100010100001", "10101000000110100110011001001011",
        "11000010010010111000101101110000", "11000111011011000101000110100011",
        "11010001100100101110100000011001", "11010110100110010000011000100100",
        "11110100000011100011010110000101", "00010000011010101010000001110000",
        "00011001101001001100000100010110", "00011110001101110110110000001000",
        "00100111010010000111011101001100", "00110100101100001011110010110101",
        '00111001000111000000110010110011', "01001110110110001010101001001010",
        "01011011100111001100101001001111", "01101000001011100110111111110011",
        "01110100100011111000001011101110", "01111000101001010110001101101111",
        "10000100110010000111100000010100", "10001100110001110000001000001000",
        "10010000101111101111111111111010", "10100100010100000110110011101011",
        "10111110111110011010001111110111", "11000110011100010111100011110010"
    ];
    var W = new Array(64);

    // todo: Chunk Loop
    for (msg of getMessage) {
        // Initialize variables a - h and set them equal to the current hash values respectively. h0 - h7
        var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
        var T2;
        var T2;

        // Copy the input data from step 1 into a new array where each entry is a 32-bit word:
        var counter = 0
        for (var i = 0; i < 64; i++) {
            if (i < 16) {
                W[i] = (msg.slice(counter, counter + 32));
                counter += 32
            }
            else {
                W[i] = additionMod32(additionMod32(additionMod32(S1(W[i - 2]), W[i - 7]), S0(W[i - 15])), W[i - 16]);
            }

            // compression cycle
            T1 = ((parseInt(h, 2) + parseInt(Σ1(e), 2) + parseInt(Ch(e, f, g), 2) + parseInt(K[i], 2) + parseInt(W[i], 2)) % Math.pow(2, 32)).toString(2).padStart(32, "0");
            // T1 = additionMod32(additionMod32(additionMod32(h, Σ1(e)), Ch(e, f, g)), K[i], W[i]);
            T2 = additionMod32(Σ0(a), Maj(a, b, c));

            h = g;
            g = f;
            f = e;
            e = additionMod32(d, T1);
            d = c;
            c = b;
            b = a;
            a = additionMod32(T1, T2);
        }

        // compute the new intermediate hash value 
        H[0] = additionMod32(H[0], a);
        H[1] = additionMod32(H[1], b);
        H[2] = additionMod32(H[2], c);
        H[3] = additionMod32(H[3], d);
        H[4] = additionMod32(H[4], e);
        H[5] = additionMod32(H[5], f);
        H[6] = additionMod32(H[6], g);
        H[7] = additionMod32(H[7], h);
    }
    console.log(convertToHex(H))
    document.getElementById("ti2").value = convertToHex(H);
}

function textToBin(text) {
    var length = text.length
    var output = [];
    for (var i = 0; i < length; i++) {
        var bin = text[i].charCodeAt(0).toString(2).padStart(8, "0");
        output.push(bin)
        // output.push(Array(8 - bin.length + 1).join("0") + bin);
    }
    return output.join("");
}
function convertToHex(arr) {
    let result = ""
    for (let i = 0; i < arr.length; i++) {
        result += parseInt(arr[i], 2).toString(16)
    }
    return result
}

function padZero(strings, lengthM) {
    l = lengthM
    k = (448 % 512) - (l + 1)
    while (k) {
        strings += "0";
        k = k - 1;
    }

    // adding last 64-bits
    let lengthInBinary = l.toString(2).padStart(64, "0");
    strings = strings + lengthInBinary
    return strings
}

function getMessageBlocks(inputMessage) {
    // todo: Convert “hello world” to binary:
    let result = textToBin(inputMessage);
    var messageBlocks = [];
    var block = '';
    let i = 0;
    while (i < result.length) {
        block = result.slice(i, i + 512);
        if (block.length < 512) {
            var blockLength = block.length;
            //  Append a single 1:
            block += "1";
            // todo: Pad with 0’s until data is a multiple of 512, less 64 bits (448 bits in our case)
            block = padZero(block, blockLength);
        }
        messageBlocks.push(block);
        i += 512;
    }
    console.log(messageBlocks, messageBlocks[((messageBlocks.length)-1)].length)
    return messageBlocks;
}

function ROTR(n, str) {
    return str.substring(str.length - n, str.length) + str.substring(0, str.length - n);
}
// console.log(ROTR(6,"01010001000011100101001001111111"))
// console.log("11111101010001000011100101001001 - correct")
// console.log(ROTR(11,"01010001000011100101001001111111"))
// console.log("01001111111010100010000111001010 - correct")
// console.log(ROTR(25,"01010001000011100101001001111111"))
// console.log("10000111001010010011111110101000 - correct")

function rightShit(str, n) {
    return str.substring(0, str.length - n).padStart(32, "0")
}
function XOR(str1, str2) {
    let s = "";
    for (let i = 0; i < 32; i++) {
        if (str1.charAt(i) != str2.charAt(i)) {
            s += "1";
        } else {
            s += "0";
        }
    }
    return s;
}
// console.log(XOR("00000000000000000000000000000000", "11111111111111111111111111111111"))

function Σ0(x) {
    return XOR(XOR(ROTR(2, x), ROTR(13, x)), ROTR(22, x));
}
function Σ1(x) {
    return XOR(XOR(ROTR(6, x), ROTR(11, x)), ROTR(25, x));
}
// console.log(Σ1("01010001000011100101001001111111"))
// // console.log("00110101100001110010011100101011 correct value")
function S0(x) {
    return XOR(XOR(ROTR(7, x), ROTR(18, x)), rightShit(x, 3))
}
// console.log(S0("01101111001000000111011101101111"))
// // console.log("11001110111000011001010111001011 - S0")

function S1(x) {
    return XOR(XOR(ROTR(17, x), ROTR(19, x)), rightShit(x, 10));
}
// console.log(S1("01111101101010000110010000000101"))
// // console.log("00111110100111010111101101111000 - S1")

function Ch(x, y, z) {
    x = "0b" + x;
    y = "0b" + y;
    z = "0b" + z;
    var add = ((((x & y)) ^ ((((~x)) & z))) >>> 0).toString(2);

    result = "00000000000000000000000000000000".slice(0, add.length * -1) + add;
    return result;
}
// console.log(Ch("01010001000011100101001001111111", "10011011000001010110100010001100", "00011111100000111101100110101011"))
// // 00011111100001011100100110001100 --correct value
function Maj(x, y, z) {
    x = "0b" + x;
    y = "0b" + y;
    z = "0b" + z;
    var add = ((((x & y)) ^ ((x & z)) ^ ((y & z))) >>> 0).toString(2);
    result = "00000000000000000000000000000000".slice(0, add.length * -1) + add;
    return result;
}


function additionMod32(str1, str2) {
    var num = (parseInt(str1, 2) + parseInt(str2, 2));
    var result = (num % Math.pow(2, 32)).toString(2).padStart(32, "0")
    return result;
}
