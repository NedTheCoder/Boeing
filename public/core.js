var boeingNotes = angular.module('boeingNotes', []);

function noteController($scope, $http, $timeout) {
    $scope.currentNote = {};
    var timer;

    // get all notes
    $http.get('/api/notes')
        .success(function(data) {
            $scope.notes = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    // check if a note with the specified title already exists
    $scope.titleExists = function(title) {
        for (var i=0; i < $scope.notes.length; i++) {
            if ($scope.notes[i].title === title) {
                return true;
            }
        }
        return false;
    }

    // get the note content for the given title
    // or an empty string if title not found
    $scope.getContent = function(title) {
        for (var i=0; i < $scope.notes.length; i++) {
            if ($scope.notes[i].title === title) {
                return $scope.notes[i].content;
            }
        }
        return "";
    }

    // show an error for 3 seconds
    $scope.showError = function(message) {
        // if a previous error is currently active, cancel the timeout promice
        $timeout.cancel(timer);
        // set the error message and show it
        $scope.errorMessage = message;
        $scope.showErrorMessage = true;
        // hide the error message after three seconds
        timer = $timeout(function(){ $scope.showErrorMessage = false; }, 3000);
    }

    // creating a new note
    $scope.createNote = function() {
        // we allow an empty note content, but the note title must not be empty
        if(($scope.currentNote.title === undefined) || ($scope.currentNote.title === "")) {
            $scope.showError("Cannot add a note without a title!");
            return;
        }

        // we do not allow duplicate titles
        if($scope.titleExists($scope.currentNote.title)) {
            $scope.showError("A note with specified title already exists!");
            return;
        }

        // we can add the note
        $http.post('/api/notes', $scope.currentNote)
            .success(function(data) {
                // clear the form
                $scope.currentNote = {}; 
                // update notes
                $scope.notes = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a note
    $scope.deleteNote = function(title) {
        // title must not be empty
        if(($scope.currentNote.title === undefined) || ($scope.currentNote.title === "")) {
            $scope.showError("Cannot delete a note without a title!");
            return;
        }

        // check if the note with the specified title exists
        if($scope.titleExists($scope.currentNote.title) == false) {
            $scope.showError("A note with specified title does not exist!");
            return;
        }

        // delete the note
        $http.delete('/api/notes/' + title)
            .success(function(data) {
                // clear the form
                $scope.currentNote = {}; 
                // update notes
                $scope.notes = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // update a note
    $scope.updateNote = function() {
        // title must not be empty
        if(($scope.currentNote.title === undefined) || ($scope.currentNote.title === "")) {
            $scope.showError("Cannot update a note without a title!");
            return;
        }

        // check if the note with the specified title exists
        if($scope.titleExists($scope.currentNote.title) == false) {
            $scope.showError("A note with specified title does not exist!");
            return;
        }

        // do not bother if the content of the note has'n been changed
        if($scope.getContent($scope.currentNote.title) == $scope.currentNote.content) {
            $scope.showError("A note has not been changed!");
            return;
        }

        // update the note
        $http.post('/api/notes/' + JSON.stringify($scope.currentNote))
            .success(function(data) {
                // clear the form
                $scope.currentNote = {}; 
                // update notes
                $scope.notes = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // select a note
    $scope.selectNote = function(note) {
        $scope.currentNote.title = note.title;
        $scope.currentNote.content = note.content;
    };

}

