module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			my_target: {
				files: {
					"./ramble.min.js": ["./ramble.js"]
				}
			}
		},
		watch: {
			files: ["./ramble.js"],
			tasks: ["uglify"]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", "watch");
};
