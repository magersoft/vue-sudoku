const getChunks = (array, lenght) => {
    let chunks = [], i = 0, n = array.length;
    while (i < n) {
        chunks.push(array.slice(i, i += lenght));
    }
    return chunks
};

export {
    getChunks
}