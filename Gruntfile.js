module.exports = function(grunt) {
	var config = {
			app: 'app',
			dist: 'dist',
			port: 9000,
			livereload: 35721
		},
		serveStatic = require('serve-static');
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		config: config,
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			options: {
				port: '<%= config.port%>',
				open: true,
				// keepalive: true,
				livereload:'<%= config.livereload%>',
				hostname: 'localhost'//需用localhost，否则livereload无效
			},
			livereload: {
				options: {
					middleware: function(connect) {
						return [
							// serveStatic('.tmp'),
							serveStatic(config.app)
						];
					}
				}
			},
			dist: {
				options: {
					base: '<%= config.dist %>/',
					livereload:false
				}
			}
		},
		copy: {
			dist:{
				files:[{
					expand:true,
					cwd:'<%= config.app %>',
					src:['*.html','js/*.js','img/**','plugin/**'],
					dest:'<%= config.dist %>',
					extDot:'last'
				}]
			},
			css:{
				files:[{
					expand:true,
					cwd:'<%= config.app %>/css',
					src:['{,*/}*.css'],
					dest:'.tmp/css',
					ext:'.css'
				}]
			}
		},
		less:{
			dist:{
				files:[{
					expand:true,
					cwd:'<%= config.app %>/css',
					src:['*.less'],
					dest:'<%= config.dist %>/css',
					ext:'.css'
				}]
			},
			server:{
				files:[{
					expand:true,
					cwd:'<%= config.app %>/css',
					src:['{,*/}*.less'],
					dest:'<%= config.app %>//css',
					ext:'.css'
				}]
			}
		},
		concurrent:{
			dist:[
				'less',
				'copy:css',
			],
			server:[
				'less:server'/*,
				'copy:css'*/
			]
		},
		clean:{
			dist:{
				files:[{
					dot:true,
					src:[
						'.tmp',
						'<%= config.dist %>/*',
						'!<%= config.dist %>/.git*'
					]
				}]
			},
			server:'.tmp'
		},
		jshint: {
			server: {
				files: {
					src: ['<%= config.app %>/js/{,*/}*.js']
				}
			}
		},
		wiredep:{
			app:{
				src:['<%= config.app %>/index.html']
			}
		},
		watch: {
			gruntfile: {
				files: ['Gruntfile.js']
				// options: {
				// 	reload: true
				// }
			},
			less: {
				files: ['<%= config.app %>/css/{,*/}*.less'],
				tasks: ['less:server']
			},
			css:{
				files: ['<%= config.app %>/css/{,*/}*.css'],
				tasks: ['newer:copy:css']
			},
			// js:{
			// 	files:['<%= config.app %>/js/{,*/}*.js'],
			// 	tasks:['jshint'],
			// 	options:{
			// 		livereload:true
			// 	}
			// },
			livereload:{
				files:[
					'<%= config.app %>/{,*/}*.html',
					'.tmp/css/{,*/}*.css',
					'<%= config.app %>/images/{,*/}*'
				],
				options:{
					livereload:'<%= connect.options.livereload %>'
				}
			}
		},
		useminPrepare: {
			html: '<%= config.app %>/*.html',
			options: {
				dest: '<%= config.dist %>',
			}
		},
		filerev: {
			options: {
				algorithm: 'md5',
				length: 8
			},
			dist: {
				src: [
					'<%= config.dist %>/img/**/*.{jpg,jpeg,gif,png,webp}',
					'<%= config.dist %>/css/{,*/}*.css',
					'<%= config.dist %>/js/{,*/}*.js',
				]
			}
		},
		usemin:{
			options:{
				assetsDirs:[
					'<%= config.dist %>',
					'<%= config.dist %>/img',
					'<%= config.dist %>/css',
				]
			},
			html: '<%= config.dist %>/{,*/}*.html',
			css: '<%= config.dist %>/css/{,*/}*.css'
		}
	});

	grunt.registerTask('server', 'Start a custom static web server.', function(target) {
		grunt.log.writeln('Starting static web server in "www-root" on port 8000.');
		if (grunt.option('allow-remote')) {
			grunt.log.writeln('允许外部访问');
			grunt.config.set('connect.options.hostname', '0.0.0.0');
		}
		if (target === "dist") {
			return grunt.task.run([ 'build', 'connect:dist:keepalive'])
		}
		grunt.task.run([
			'clean:server',
			'wiredep',
			'concurrent:server',
			'connect:livereload',
			'watch'
		])
	});
	grunt.registerTask('build', [
		'clean:dist',
		'wiredep',
		'useminPrepare',
		'concurrent:dist',
		'concat',
		'cssmin',
		'uglify',
		'copy:dist',
		'filerev',
		'usemin'
	]);
}