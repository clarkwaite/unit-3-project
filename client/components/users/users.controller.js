
UsersController.$inject = ['$http', '$state', '$stateParams', 'UsersService', '$scope'];

function UsersController($http, $state, $stateParams, UsersService, $scope) {

    let vm = this;
    //this is what runs as the page loads
    function initialize() {
        getAllUsers();
    }
    initialize();
    //get all users to render on the page
    function getAllUsers() {
        UsersService.getAllUsers()
            .then(
            function success(response) {
                // if the call is successful, return the list of users
                vm.userEntries = response.data;
            },
            function failure(response) {
                console.log('Error retrieving User Entries from database!');
            }
            );
    }
    // This function handles our form submission.
    //add a new user
    vm.addNewUser = function () {

        // the new User object will be created by binding to the form inputs
        const newUser = {
            first_name: vm.newUserFirstName,
            last_name: vm.newUserLastName,
            username: vm.newUserUsername,
            email: vm.newUserEmail
        };
        //add a new user
        UsersService.addNewUser(newUser)
            .then(
            function success(response) {
                console.log('user saved')
                // only push to the userEntries array if the ajax call is successful
                const newUser = response.data;
                vm.userEntries.push(newUser);
                // then reset the form so we can submit more users
                resetForm();

            },
            function failure(response) {

                console.log('Error saving new User to database!');
            });

        function resetForm() {
            vm.newUserFirstName = '';
            vm.newUserLastName = '';
            vm.newUserUsername = '';
            vm.newUserEmail = '';
        }
        resetForm();
    };
    //renders the show user page on click
    vm.showUser = function (userId) {
        $state.go('showUser', { userId: userId });
    }

}

module.exports = UsersController;
