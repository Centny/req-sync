{
	'targets' : [
		{
		    'target_name' : 'curlr',
		    'sources' : ['lib/curlr.cc'],
		    'include_dirs': ["<!(node -e \"require('nan')\")"],
		    'conditions':[
				['OS=="win"',{
						'include_dirs': ["./curl/include"],
						'libraries' : ['-llibcurl'],
						'configurations':{
							"Release":{
								"msvs_settings":{
									"VCLinkerTool":{
										"AdditionalLibraryDirectories":[
											"../curl/lib"
										]
									}
								}
							}
						}
						
				}],
				['OS!="win"',{
						'libraries' : ['-lcurl']
				}],
		    ],
		}
	]
}
