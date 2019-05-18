export const Solved = board => {
    let solved = [];
    let steps = 0;

    const digits = [1,2,3,4,5,6,7,8,9];
    const numberSquares = 81;
    const unknown = 'unknown';

    init(board); solve();

    function init(board) {
        steps = 0;
        for (let row = 0; row < 9; row++) {
            solved[row] = [];
            for (let column = 0; column < 9; column++) {
                if (board[row][column]) {
                    solved[row][column] = [board[row][column], 'in', []];
                } else {
                    solved[row][column] = [0, unknown, digits];
                }
            }
        }
    }

    function solve() {
        let changed = 0;

        do {
            changed = update();
            steps++;
            if (numberSquares < steps) {
                break;
            }
        } while (changed);

        if (!isSolved() && !isFailed()) {
            backtracking();
        }
    }

    function solveMethodSingle(row, col) {
        solved[row][col][2] = arrayDiff(solved[row][col][2], rowContent(row));
        solved[row][col][2] = arrayDiff(solved[row][col][2], colContent(col));
        solved[row][col][2] = arrayDiff(solved[row][col][2], blockContent(row, col));

        if (solved[row][col][2].length === 1) {
            markSolved(row, col, solved[row][col][2][0]);
            return 1;
        }
        return 0;
    }

    function solveMethodHiddenSingle(row, col) {
        let lessSuggest;
        lessSuggest = lessRowSuggest(row, col);
        let changed = 0;
        if (lessSuggest.length === 1) {
            markSolved(row, col, lessSuggest[0]);
            changed++;
        }
        lessSuggest = lessColSuggest(row, col);
        if (lessSuggest.length === 1) {
            markSolved(row, col, lessSuggest[0]);
            changed++;
        }
        lessSuggest = lessBlockSuggest(row, col);
        if (lessSuggest.length === 1) {
            markSolved(row, col, lessSuggest[0]);
            changed++;
        }
        return changed;
    }

    function update() {
        let changed = 0;

        let different = arrayDiff(solved[1][3][2], rowContent(1));
        different = arrayDiff(different, colContent(3));
        different = arrayDiff(different, blockContent(1, 3));
        different;

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (unknown !== solved[row][col][1]) {
                    continue;
                }

                changed += solveMethodSingle(row, col);

                changed += solveMethodHiddenSingle(row, col);
            }
        }

        return changed;
    }

    function markSolved(row, col, solve) {
        solved[row][col][0] = solve;
        solved[row][col][1] = 'solved';
    }

    function arrayDiff(array1, array2) {
        let arrayDiff = [];
        for (let i = 0; i < array1.length; i++) {
            let found = false;
            for (let k = 0; k < array2.length; k++) {
                if (array1[i] === array2[k]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                arrayDiff[arrayDiff.length] = array1[i];
            }
        }
        return arrayDiff;
    }

    function rowContent(row) {
        let content = [];
        for (let i = 0; i < 9; i++) {
            if (unknown !== solved[row][i][1]) {
                content[content.length] = solved[row][i][0];
            }
        }
        return content;
    }

    function colContent(col) {
        let content = [];
        for (let i = 0; i < 9; i++) {
            if (unknown !== solved[i][col][1]) {
                content[content.length] = solved[i][col][0];
            }
        }
        return content;
    }

    function blockContent(row, col) {
        let content = [];
        let offset = blockOffset(row, col);

        for (let i = 0; i < 3; i++) {
            for (let k = 0; k < 3; k++) {
                if (unknown !== solved[offset.row+i][offset.col+k][1]) {
                    content[content.length] = solved[offset.row+i][offset.col+k][0];
                }
            }
        }
        return content;
    }

    function blockOffset(row, col) {
        return {
            col: Math.floor(col/3) * 3,
            row: Math.floor(row/3) * 3,
        }
    }

    function lessRowSuggest(row, col) {
        let lessSuggest = solved[row][col][2];
        for (let i = 0; i < 9; i++) {
            if (i === col || unknown !== solved[row][i][1]) {
                continue;
            }
            lessSuggest = arrayDiff(lessSuggest, solved[row][i][2]);
        }
        return lessSuggest;
    }

    function lessColSuggest(row, col) {
        let lessSuggest = solved[row][col][2];
        for (let i = 0; i < 9; i++) {
            if (i === row || unknown !== solved[i][col][1]) {
                continue;
            }
            lessSuggest = arrayDiff(lessSuggest, solved[i][col][2]);
        }
        return lessSuggest;
    }

    function lessBlockSuggest(row, col) {
        let lessSuggest = solved[row][col][2];
        let offset = blockOffset(row, col);
        for (let i = 0; i < 3; i++) {
            for (let k = 0; k < 3; k++) {
                if (((offset.row+i) === row && (offset.col+k) === col) || unknown !== solved[offset.row+i][offset.col+k][1]) {
                    continue;
                }
                lessSuggest = arrayDiff(lessSuggest, solved[offset.row+i][offset.col+k][2]);
            }
        }
        return lessSuggest;
    }

    function isSolved() {
        let isSolved = true;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (unknown === solved[row][col][1]) {
                    isSolved = false;
                }
            }
        }
        return isSolved;
    }

    function isFailed() {
        let isFailed = false;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (unknown === solved[row][col][1] && !solved[row][col][2].length) {
                    isFailed = true;
                }
            }
        }
        return isFailed;
    }

    function backtracking() {
        let inValue = [[], [], [], [], [], [], [], [], []];
        let minRow = -1, minCol = -1, suggestContent = 0;

        for (let row = 0; row < 9; row++) {
            inValue[row].length = 9;
            for (let col = 0; col < 9; col++) {
                inValue[row][col] = solved[row][col][0];
                if (unknown === solved[row][col][1] && (solved[row][col][2].length < suggestContent || !suggestContent)) {
                    suggestContent = solved[row][col][2].length;
                    minRow = row;
                    minCol = col;
                }
            }
        }

        for (let i = 0; i < suggestContent; i++) {
            inValue[minRow][minCol] = solved[minRow][minCol][2][i];
            const sudoku = new Solved(inValue);
            if (sudoku.isSolved()) {
                let outValue = sudoku.solved();

                for (let row = 0; row < 9; row++) {
                    for (let col = 0; col < 9; col++) {
                        if (unknown === solved[row][col][1]) {
                            markSolved(row, col, outValue[row][col][0])
                        }
                    }
                }
                return;
            }
        }
    }

    return solved;
};