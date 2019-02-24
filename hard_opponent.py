import copy

def minimax_ttt(board_matrix, max_user):

    def user_type():
        if max_user:
            return "X"
        return "O"

    def checkForWinner():
        for r in range(3):
            if (board_matrix[r][0] != "" and
                board_matrix[r][0] == board_matrix[r][1] and
                board_matrix[r][0] == board_matrix[r][2]):
                return board_matrix[r][0]
            elif (board_matrix[0][r] != "" and
                board_matrix[0][r] == board_matrix[1][r] and
                board_matrix[0][r] == board_matrix[2][r]):
                return board_matrix[0][r]

        # Check for diagonals
        if (board_matrix[0][0] != "" and
            board_matrix[0][0] == board_matrix[1][1] and
            board_matrix[0][0] == board_matrix[2][2]):
            return board_matrix[0][0]
        elif (board_matrix[2][0] != "" and
            board_matrix[2][0] == board_matrix[1][1] and
            board_matrix[2][0] == board_matrix[0][2]):
            return board_matrix[2][0]
        return None

    def max_index(l):
        idx = 0
        max_val = -1
        for i in range(len(l)):
            if l[i] > max_val:
                idx = i
                max_val = l[i]
        return idx
    
    def min_index(l):
        idx = 0
        min_val = 11
        for i in range(len(l)):
            if l[i] < min_val:
                idx = i
                min_val = l[i]
        return idx

    potential_scores = []
    potential_moves = []
    for i in range(3):
        for j in range(3):
            if board_matrix[i][j] == "":
                potential_moves.append([i,j])

    # If no more moves are avail, then calculate the score
    winner = checkForWinner()
    if winner or len(potential_moves) == 0:
        if winner == "X":
            return 10, None
        elif winner == "O":
            return -10, None
        else:
            return 0, None  #it's a draw
    

    # When the human user makes the first move of the game, the first
    # choice the computer made was taking around 900 ms to complete. So,
    # for the first choice the computer needs to make, I simply hard-coded 
    # the choice the computer would've made anyways given what the human 
    # user first selected.
    if len(potential_moves) == 8:
        if (board_matrix[0][0] == "X" or
            board_matrix[0][2] == "X" or
            board_matrix[2][0] == "X"):
            return 0, [1,1]
        elif (board_matrix[0][1] == "X" or
            board_matrix[1][0] == "X" or
            board_matrix[1][1] == "X" or
            board_matrix[2][2] == "X"):
            return 0, [0,0]
        elif board_matrix[2][1] == "X":
            return 0, [0,1]
        elif board_matrix[1][2] == "X":
            return 0, [0,2]


    for move in potential_moves:
        possible_board_matrix = copy.deepcopy(board_matrix)
        possible_board_matrix[move[0]][move[1]] = user_type()
        score, best_move = minimax_ttt(possible_board_matrix,not max_user)
        potential_scores.append(score)
    

    if max_user:
        idx = max_index(potential_scores)
        return potential_scores[idx], potential_moves[idx]
    else:
        idx = min_index(potential_scores)
        return potential_scores[idx], potential_moves[idx]
    
    
    
        
        

