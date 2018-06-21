angular.module('dashboard')
    .controller('dashboardController', function($scope, $http, $timeout) {
        this.user = {
            "_id": "tester"
        };
        this.isEditUser = false;
        this.editedUser = null;
        this.messages = [];
        this.toggleEditUser = () => {
            if (this.isEditUser) {
                $http({
                        method: 'PUT',
                        url: `/api/users/${this.user._id}`,
                        data: {}
                    })
                    .then((res) => {
                        console.log(res);
                        this.isEditUser = false;
                    })
                    .catch((res) => {
                        let message = {
                            type: 'danger',
                            text: `${res.status} ${res.statusText}. ${res.data.message}`
                        };
                        this.pushMessage(message, 3000);
                    });
            } else {
                this.editedUser = JSON.parse(JSON.stringify(this.user));
                this.isEditUser = true;
            }
        };
        this.getUser = () => {
            return $http({
                method: 'GET',
                url: `/api/users/${this.user._id}`
            });
        };
        this.saveUser = (userObject) => {

        };
        this.pushMessage = (message, delay) => {
            this.messages.push(message);
            $timeout(() => {
                this.messages.splice(this.messages.indexOf(message), 1);
            }, delay);
        };
        this.getUser().then((res) => {
            this.user = res.data;
        }).catch((res) => {
            let message = {
                type: 'danger',
                text: `${res.status} ${res.statusText}. ${res.data.message}`
            };
            this.pushMessage(message, 3000);
        });
    });