module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: ["./src/fluent.js"]
		},
		uglify: {
			js: {
				files: {
					"./src/fluent.min.js": ["./src/fluent.js"]
				}
			}
		},
		watch: {
			files: ["./src/fluent.js"],
			tasks: ["jshint", "uglify"]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", "watch");
};
