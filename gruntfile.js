module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: ["./fluent.js"]
		},
		uglify: {
			my_target: {
				files: {
					"./fluent.min.js": ["./fluent.js"]
				}
			}
		},
		watch: {
			files: ["./fluent.js"],
			tasks: ["jshint", "uglify"]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", "watch");
};
