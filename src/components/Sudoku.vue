<template>
    <main class="main">
        <table class="board">
            <tbody class="board__body">
            <tr v-for="(row, rowIndex) in sudoku"
                class="row row__border"
                :class="(rowIndex % 3 === 2 && rowIndex !== 8) ? 'row__border--bottom' : ''"
                :key="rowIndex">
                <td v-for="(col, colIndex) in row"
                    class="column column__border"
                    :class="[
                        (colIndex % 3 === 2 && colIndex !== 8) ? 'column__border--right' : '',
                        col.invalid ? 'invalid' : 'valid'
                    ]"
                    :key="colIndex">
                    <input type="tel"
                           :data-row="rowIndex"
                           :data-column="colIndex"
                           :value="col.value"
                           :readonly="!col.disabled"
                            @click="columnTarget"
                            @keyup="columnEnter">
                </td>
            </tr>
            </tbody>
        </table>
        <br>
        <b-row align-h="between">
            <b-col>
                <b-button variant="outline-primary" @click="buildBoard">Build New Board</b-button>
            </b-col>
            <b-col>
                <b-button variant="success" @click="solve">Solved</b-button>
            </b-col>
        </b-row>
    </main>
</template>

<script>
    import { generatedNumbers, getRandomBoard } from './../utils/boards';
    import { getChunks } from './../utils/helpers';
    import { Solved } from "../utils/solved";

    export default {
        name: "Sudoku",
        data() {
            return {
                sudoku: null,
                gameLength: 9,
                numberSquares: 81,
            }
        },
        mounted() {
            this.buildBoard();
        },
        methods: {
            buildBoard() {
                let sudoku = [];
                const board = getRandomBoard(generatedNumbers);
                for (let i = 0; i < this.numberSquares; i++) {
                    sudoku.push((board[i] === '0') ? null : parseInt(board[i]))
                }
                sudoku = getChunks(sudoku, this.gameLength);
                for (let row = 0; row < 9; row++) {
                    for (let column = 0; column < 9; column++) {
                        const value = sudoku[row][column];
                        sudoku[row][column] = {
                            row,
                            column,
                            value,
                            disabled: value === null,
                            invalid: false
                        }
                    }
                }
                this.sudoku = sudoku;
            },
            validate() {
                const allValid = () => {
                    for (let row = 0; row < 9; row++) {
                        for (let column = 0; column < 9; column++) {
                            this.sudoku[row][column].invalid = false;
                        }
                    }
                };
                const invalid = array => {
                    let numbers = {};
                    for (let i = 0; i < 9; i++) {
                        if (array[i].value !== null && numbers.hasOwnProperty(array[i].value)) {
                            array[i].invalid = true;
                            array[numbers[array[i].value]].invalid = true;
                        }
                        numbers[array[i].value] = i;
                    }
                };
                const validator = () => {
                    allValid();

                    for (let row = 0; row < 9; row++) {
                        let array = [];
                        for (let column = 0; column < 9; column++) {
                            array.push(this.sudoku[row][column]);
                        }
                        invalid(array);
                    }

                    for (let column = 0; column < 9; column++) {
                        let array = [];
                        for (let row = 0; row < 9; row++) {
                            array.push(this.sudoku[row][column]);
                        }
                        invalid(array);
                    }
                    const sudoku = this.sudoku;
                    invalid([sudoku[0][0], sudoku[0][1], sudoku[0][2], sudoku[1][0], sudoku[1][1], sudoku[1][2], sudoku[2][0], sudoku[2][1], sudoku[2][2]]);
                    invalid([sudoku[3][0], sudoku[3][1], sudoku[3][2], sudoku[4][0], sudoku[4][1], sudoku[4][2], sudoku[5][0], sudoku[5][1], sudoku[5][2]]);
                    invalid([sudoku[6][0], sudoku[6][1], sudoku[6][2], sudoku[7][0], sudoku[7][1], sudoku[7][2], sudoku[8][0], sudoku[8][1], sudoku[8][2]]);
                    invalid([sudoku[0][3], sudoku[0][4], sudoku[0][5], sudoku[1][3], sudoku[1][4], sudoku[1][5], sudoku[2][3], sudoku[2][4], sudoku[2][5]]);
                    invalid([sudoku[3][3], sudoku[3][4], sudoku[3][5], sudoku[4][3], sudoku[4][4], sudoku[4][5], sudoku[5][3], sudoku[5][4], sudoku[5][5]]);
                    invalid([sudoku[6][3], sudoku[6][4], sudoku[6][5], sudoku[7][3], sudoku[7][4], sudoku[7][5], sudoku[8][3], sudoku[8][4], sudoku[8][5]]);
                    invalid([sudoku[0][6], sudoku[0][7], sudoku[0][8], sudoku[1][6], sudoku[1][7], sudoku[1][8], sudoku[2][6], sudoku[2][7], sudoku[2][8]]);
                    invalid([sudoku[3][6], sudoku[3][7], sudoku[3][8], sudoku[4][6], sudoku[4][7], sudoku[4][8], sudoku[5][6], sudoku[5][7], sudoku[5][8]]);
                    invalid([sudoku[6][6], sudoku[6][7], sudoku[6][8], sudoku[7][6], sudoku[7][7], sudoku[7][8], sudoku[8][6], sudoku[8][7], sudoku[8][8]]);
                };

                return validator();
            },
            columnTarget(event) {
                event.target.readOnly ? event.target.blur() : event.target.select();
            },
            columnEnter(event) {
                const element = event.target;
                let value = element.value;
                if (value.length > 1) {
                    element.value = value[0];
                    value = element.value;
                }
                if (!/^[1-9]$/.test(value)) {
                    event.target.value = '';
                }

                const row = parseInt(element.dataset.row);
                const column = parseInt(element.dataset.column);
                this.sudoku[row][column].value = element.value.length > 0 ? parseInt(value) : null;

                this.validate();

                if (value.length > 0) {
                    event.target.blur();
                }
            },
            solve() {
                let solved;
                try {
                    solved = Solved(this.sudoku.map(row => row.map(column => column.value ? column.value : 0)));
                } catch (e) {
                    alert(`Error solved! Please, build new board.`);
                }

                if (solved.length !== 9) {
                    throw 'Invalid sudoku. Try again';
                }

                for (let row in solved) {
                    let columns = solved[row];
                    for (let column in columns) {
                        this.sudoku.map((r, index) => {
                            if (+row === +index) {
                                r.map((c, index) => {
                                    if (+column === +index) {
                                        c.value = columns[column][0];
                                    }
                                })
                            }
                        })
                    }
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        width: 450px;
        margin: 0 auto;
    }
    .board {
        width: auto;
        &__body {
        }
        .row {
            &__border {
                &--bottom {
                    border-bottom: 2px solid black;
                }
            }
        }
        .column {
            &__border {
                &--right {
                    border-right: 2px solid black;
                }
            }
            &.invalid {
                input {
                    color: red
                }
                input:read-only {
                    font-weight: 700;
                    border: 2px solid red;
                }
            }
        }
        input {
            display: block;
            margin: 0 auto;
            width: 50px;
            height: 50px;
            text-align: center;
            border: none;
            background: gainsboro;
            padding: 0;
            &:read-only {
                font-weight: 700;
            }
        }
    }
</style>