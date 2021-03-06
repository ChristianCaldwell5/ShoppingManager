angular.module('todo', ['ionic'])

/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {
    
  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }


  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
    
    $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.activeProject.tasks, function(project) {
      count += project.done ? 0 : 1;
    });
    return count;
  };
    $scope.remainingList = function() {
    var count = 0;
    angular.forEach($scope.projects, function(project) {
      count += 1;
    });
    return count;
  };
    
    $scope.archive = function() {
   var oldProjects = $scope.activeProject.tasks;
      $scope.activeProject.tasks = [];

   angular.forEach(oldProjects, function(project) {
    if (!project.done) $scope.activeProject.tasks.push(project);
   });

   Projects.save($scope.projects);
  };
    
    $scope.refresh = function(checked, index) {
    Projects.save($scope.projects);
    };
    
    $scope.removeTodos = function(todo) {
      var tempTodos = $scope.activeProject.tasks;
      tempTodos.splice(tempTodos.indexOf(todo), 1);
      Projects.save($scope.projects);
    };
    $scope.removeAll = function(todo) {
        var tempTodos = $scope.activeProject.tasks;
        tempTodos.splice(0);
        Projects.save($scope.projects); 
    };
    
    $scope.removeProject = function(project) {
        var tempProject = $scope.projects;
        tempProject.splice(tempProject.indexOf(project), 1);
        Projects.save($scope.projects);
        console.log($scope.projects.length);
        if($scope.projects.length == 0) {
            while(true) {
            var projectTitle = prompt('You are deleting your last list! You Need at least one List to continue! Where are you shopping now?:');
                if(projectTitle) {
                  createProject(projectTitle);
                  break;
                }
            }
        }
    }
    
    $scope.removeAllProject = function(project) {
        var tempProject = $scope.projects;
        tempProject.splice(0);
        Projects.save($scope.projects);
        if($scope.projects.length == 0) {
            while(true) {
            var projectTitle = prompt('You are deleting your last list! You Need at least one List to continue! Where are you shopping now?:');
                if(projectTitle) {
                  createProject(projectTitle);
                  break;
                }
            }
        } 
    }
    
    
    

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Where Are You Shopping?');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    if(!task.title || !task.amount){
        return;
    }
    $scope.activeProject.tasks.push({
      title: task.title,
        amount: task.amount,
        desc: task.desc,
        done:false
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);
      task.title = "";
      task.amount = "";
      task.desc = "";
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Where are you shopping?:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  }, 1000);

})