module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: ["./ramble.js"]
		},
		uglify: {
			my_target: {
				files: {
					"./ramble.min.js": ["./ramble.js"]
				}
			}
		},
		watch: {
			files: ["./ramble.js"],
			tasks: ["jshint", "uglify"]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", "watch");
};
