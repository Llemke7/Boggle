$(document).ready(function() {
    let totalScore = 0;
    let gameActive = true;

    // Timer 
    const gameTimeInSeconds = 60;
    let timeLeft = gameTimeInSeconds;

    function startTimer() {
        const timerElement = $('#timer');
        const timerInterval = setInterval(function() {
            timeLeft--;
            timerElement.text(`Time left: ${timeLeft} seconds`);

            if (timeLeft === 0) {
                clearInterval(timerInterval);
                gameActive = false;
                $('#guess').prop('disabled', true);

                axios.post('/game_end', { score: totalScore })
                    .then(function(response) {
                        const gamesPlayed = response.data.games_played;
                        const highestScore = response.data.highest_score;
                        console.log(`Games played: ${gamesPlayed}, Highest score: ${highestScore}`);
                    })
                    .catch(function(error) {
                        console.error('Error:', error);
                    });
            }
        }, 1000);
    }

    
    startTimer();

    $('#guessForm').submit(function(event) {
        event.preventDefault();

        if (!gameActive) {
            return; 
        }

        const guess = $('#guess').val();

        axios.post('/check_guess', { guess: guess })
            .then(function(response) {
                const result = response.data.result;

                if (result === 'ok') {
                    const wordLength = guess.length;
                    totalScore += wordLength;
                    displayResultMessage(result);
                    displayScore();
                } else {
                    displayResultMessage(result);
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
            });
    });

    //Results
    function displayResultMessage(result) {
        const resultMessage = $('#resultMessage');
        if (result === 'ok') {
            resultMessage.text(`Valid word! Scored ${guess.length} points.`);
        } else if (result === 'not-on-board') {
            resultMessage.text('Valid word but not on the board.');
        } else if (result === 'not-word') {
            resultMessage.text('Invalid word, not in dictionary.');
        }
    }

    //Scores
    function displayScore() {
        const scoreElement = $('#score');
        scoreElement.text(`Score: ${totalScore}`);
    }
});

