mtMaker.controller('GrommetMakerCtrl', function($scope, $http, $log) {

    this.isConfigurable = true;

    var baseEndPointUrl = "http://localhost:8080/public_api/v1/time_requests";
    var apiToken = "buyer_api_token";
    var endPointUrl = baseEndPointUrl+"?api_token="+apiToken;
    var staticDataUrl = "https://www.dropbox.com/s/sswx399mk3rchu7/grommetStatic.dxf?dl=0";
    $scope.submitButtonContent = "MakeTime";
    $scope.messages = null;
    $scope.pageTitle = "Grommet Maker";
    $scope.materials = [
        {
            name: 'aluminum',
            value: 'Aluminum',
            colors: ['#C3C3C3', '#A3A3A3']
        }, {
            name: 'plastic',
            value: 'Plastic',
            colors: ['#FFF7C9', '#DFD7A9']
        }, {
            name: 'steel',
            value: 'Steel',
            colors: ['#939393', '#737373']
        }, {
            name: 'titanium',
            value: 'Titanium',
            colors: ['#858585', '#656565']
        }, {
            name: 'wood',
            value: 'Wood',
            colors: ['#834717', '#632707']
        }, {
            name: 'glass',
            value: 'Glass',
            colors: ['rgba(105,210,185,0.5)', 'rgba(115,220,195,0.5)']
        }
    ];
    $scope.grommet = {
        innerDimension: 10,
        outerDimension: 25,
        thickness: 2,
        material: $scope.materials[0]
    };
    $scope.strokeColor = function() {
        if ($scope.grommet.material.name === 'glass') {
            return ['rgba(63,227,192,1.0)', 'rgba(69,227,193,1.0)'];
        } else {
            return ['transparent', 'transparent'];
        }
    };

    $scope.submit = function() {

        var nodeMidpointUrl = "http://localhost:4000/grommet"

        $scope.submitButtonStart();
        $scope.buttonText = 'Okay';

        // Default values for the request.
        // 
        $scope.staticData = {
            "hours": 1,
            "machine_type": "CNC Laser",
            "material": $scope.grommet.material.value,
            "needed_by_date": moment().add(7, 'days').format('YYYY[/]MM[/]DD'),
            "notes_to_seller": "API-created request. Thickness = " + $scope.grommet.thickness,
            "pdfObj":{"innerRadius":$scope.grommet.innerDimension,"outerRadius":$scope.grommet.outerDimension}
        };

        console.log($scope.staticData);

        $http({
            url: nodeMidpointUrl,
            method:"POST",
            headers: {
                'Content-Type':'application/json'
            },
            data: $scope.staticData
        })
        .success(function(data, status, headers, config) {
            if (data.status === 'OK') {
                $scope.submitButtonFinish();
                $scope.messages = 'Your form has been sent!';
                $scope.submitted = false;
            } else {
                $scope.submitButtonReset();
                $scope.messages = 'Oops, we received your request, but there was an error processing it.';
                $scope.buttonText = "Okay";
                $log.error(data);
            }
        })
        .error(function(data, status, headers, config) {
            $scope.progress = data;
            $scope.messages = 'It doesn\'t look like you have a MakeTime account!';
            $scope.buttonText = 'Sign Up';
            $log.error(data);
            $scope.submitButtonReset();
        })
        .finally(function() {
            // Hide status messages after three seconds.
            $timeout(function() {
                $scope.messages = null;
            }, 3000);
        });
    };

    //For future AWS Uploads
    /*
    
	    $scope.creds = {
	        bucket: 'your_bucket',
	        access_key: 'your_access_key',
	        secret_key: 'your_secret_key'};
	    $scope.upload = function() {
	        // Configure The S3 Object 
	        AWS.config.update({
	            accessKeyId: $scope.creds.access_key,
	            secretAccessKey: $scope.creds.secret_key
	        });
	        AWS.config.region = 'us-east-1';
	        var bucket = new AWS.S3({
	            params: {
	                Bucket: $scope.creds.bucket
	            }
	        });

	        if ($scope.file) {
	            var params = {
	                Key: $scope.file.name,
	                ContentType: $scope.file.type,
	                Body: $scope.file,
	                ServerSideEncryption: 'AES256'
	            };

	            bucket.putObject(params, function(err, data) {
	                    if (err) {
	                        // There Was An Error With Your S3 Config
	                        alert(err.message);
	                        return false;
	                    } else {
	                        // Success!
	                        alert('Upload Done');
	                    }
	                })
	                .on('httpUploadProgress', function(progress) {
	                    // Log Progress Information
	                    console.log(Math.round(progress.loaded / progress.total * 100) + '% done');
	                });
	        } else {
	            // No File Selected
	            alert('No File Selected');
	        }};
	    /// AWS
    */
   

    //Submit request to API with ref to Static DXF file
    $scope.submitStaticDXF = function() {
        $scope.submitButtonStart();
        $scope.buttonText = 'Okay';

        // Default values for the request.
        $scope.staticData = {
            "hours": 1,
            "machine_type": "CNC Laser",
            "material": "Steel",
            "needed_by_date": moment().add(7, 'days').format('YYYY[/]MM[/]DD'),
            "notes_to_seller": "API-created request.",
            "assets": [staticDataUrl]
        };
        $http({
            url: endPointUrl,
            method:"POST",
            headers: {
                'Content-Type':'application/json'
            },
            data: $scope.staticData
        })
        .success(function(data, status, headers, config) {
            if (status === 201 ) {
                $scope.submitButtonFinish();
                $scope.messages = 'Your form has been sent!';
                $scope.submitted = false;
            } else {
                $scope.submitButtonReset();
                $scope.messages = 'Oops, we received your request, but there was an error processing it.';
                $scope.buttonText = "Okay";
                $log.error(data);
                $log.error(status);
            }
        })
        .error(function(data, status, headers, config) {
        	if (status === 401) {
	            $scope.messages = 'It doesn\'t look like you have a MakeTime account!';
	        }
            $scope.buttonText = 'Sign Up';
            $log.error(data);
            $scope.submitButtonReset();
        })
        .finally(function() {
            // Hide status messages after three seconds.
            $timeout(function() {
                $scope.messages = null;
            }, 3000);
        });
    };

    $scope.submitButtonStart = function(){
    	$scope.submitButtonContent = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
    };
    $scope.submitButtonReset = function(){
    	$scope.submitButtonContent = 'Submit';
    };
    $scope.submitButtonFinish = function(){
    	$scope.submitButtonContent = 'Done!';
    };

    //Dismisses Modal
    $scope.dismiss = function() {
        $scope.messages = null;
    };
});
