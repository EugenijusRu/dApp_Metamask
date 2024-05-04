export const formatBalance = (rawBalance) => {
    return (parseInt(rawBalance) / 1000000000000000000).toString();
};

export const convertEth2Wei = (value) => {
    return (value * 1000000000000000000).toString(16);
};

export const formatChainAsNum = (chainIdHex) => {
    return parseInt(chainIdHex);
};
