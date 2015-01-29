/**
 * @author morris
 */

var assert = require( 'assert' );
var fs = require( 'fs' );
var rmdir = require( 'rmdir' );
var File = require( 'vinyl' );
var VinylFs = require( 'vinyl-fs' );

var setup = require( './setup' );

it( 'should upload to FTP-server (streamed)', uploadTest( { buffer: false } ) );
it( 'should upload to FTP-server (buffered)', uploadTest() );

function uploadTest( fsOpt, ftpOpt ) {

	return function( done ) {

		VinylFs.src( 'test/fixtures/**' )
			.pipe( VinylFs.dest( 'test/src' ) )
			.on( 'end', mid );

		function mid() {

			VinylFs.src( 'test/src/**', fsOpt )
				.pipe( setup.vftp.dest( 'test/dest', ftpOpt ) )
				.on( 'end', end );

		}

		function end() {

			assert( fs.existsSync( 'test/dest/index.html' ) );

			rmdir( 'test/src', function( err ) {
				if ( err ) return done( err );
				rmdir( 'test/dest', function( err ) {
					if ( err ) return done( err );
					done();

				} );
			} );

		}

	}

}