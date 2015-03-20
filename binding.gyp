{
    'targets' : [
	{
	    'target_name' : 'curlr',
	    'sources' : [
			'lib/curlr.cc'
	    ],
	    'libraries' : [
			'-lcurl'
	    ],
	    'include_dirs': [
			"<!(node -e \"require('nan')\")"
	    ],
	}
    ]
}
