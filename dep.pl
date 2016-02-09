#!/usr/bin/perl

# chmod +x ket dhe hudhe te /usr/bin/ ose me nej bin tjeter

# setting paths
my $test_site_path = "/home/agli/Documents/test/";
my $live_site_path = "/home/agli/Documents/live/";

# setting branch names
my $test_branch = 'turi';
my $live_branch = 'master';



sub sanity_check{
	# dunno 
	my $current_test_branch = `git -C $test_site_path status`;
	my $current_live_branch = `git -C $live_site_path status`;

	# no git no party..
	my $git = `which git`;
	if(!$git){
		print "No git on server \n";
		return undef;
	}

	#if(-e $test_site_path and -e $live_site_path ){
	if(-e $test_site_path.'.git/' and -e $live_site_path.'.git/' ){
		print "Found testing and live repos on server on \n Testing : $test_site_path \n Live : $live_site_path \n";
	}
	else{
		print "No repos on $test_site_path / $live_site_path  ..\n";
		return undef;
	}

	# ensure the test repo is working under the correct branch
	if($current_test_branch =~ m/On branch (.*)/){
		if($1 eq $test_branch){
			print "Current testing branch is $1 \n";
			print "Branch config is OK \n";
		}
		else{
			print "Testing branch is different expected config \n";
			print "$test_branch expected and we got $1 \n";
			return undef;
		}
	}

	#ensure the live repo is working under the correct branch
	if($current_live_branch =~ m/On branch (.*)/){
		if($1 eq $live_branch){
			print "Current testing branch is $1 \n";
			print "Branch config is OK \n";
		}
		else{
			print "Live branch is different from what specified in config \n";
			print "We expected $live_branch and we got $1 \n";
			return undef;
		}
	}

	# ensure the correct branches exist
	my $branches = `git -C $test_site_path branch`;
	$branches =~ s/ //g;
	$branches =~ s/\*//g;

	if(grep /$test_branch/, split("\n",$branches)){ 
		print "Correct test branch is configured \n";
	}
	else{
		print "Branch $test_branch is missing \n";
		return undef;
	}

	if(grep /$live_branch/, split("\n",$branches)){ 
		print "Correct live is configured \n";
	}
	else{
		print "Branch $live_branch is missing \n";
		return undef;
	}

	return 1;
}

sub pull_and_merge{
	print "Here be dragons ..";
	my $pull_raport = "Updating ";
	
	$pull_raport .= `git -C $test_site_path checkout $live_branch`;
	$pull_raport .= `git -C $test_site_path pull`;
	$pull_raport .= `git -C $test_site_path fetch`;
	$pull_raport .= `git -C $test_site_path merge $test_branch`;
	$pull_raport .= `git -C $test_site_path push`;
	$pull_raport .= `git -C $test_site_path checkout $test_branch`;
	$pull_raport .= `git -C $live_site_path pull -u origin $live_branch`;
	$pull_raport .= `git -C $test_site_path status`;
	$pull_raport .= `git -C $live_site_path status`;

	#my $repo = $_;
	#if($repo eq "testing"){
	# my $pull_f = `git -C $test_site_path fetch`;
	# my $pull_p = `git -C $test_site_path pull`;		
	#}
	# if($repo eq "live"){
	# 	print "Updating/Pulling on the live repo..";
	# 	my $pull_f = `git -C $live_site_path fetch`;
	# 	my $pull_p = `git -C $live_site_path pull`;				
	# }
	
	print "$pull_raport\n";
}

# sub merge_testing{
# 	print "Merging testing on live..";
# 	my $merge_t = `git -C $test_site_path merge $test_branch`;
# 	my $push_merge_t = `git -C $test_site_path push`;	
# 	my $merge_l = `git -C $live_site_path merge $test_branch`;
# 	my $push_merge_l = `git -C $live_site_path push`;	
# 	print "Output merge testing : \n $merge_t \n";
# 	print "Output merge live : \n $merge_l \n";
# 	#print "Output push testing : \n $push_merge_t \n";
# 	#print "Output push live : \n $push_merge_l \n";
# }

# sub revert_last{

# }

if(sanity_check()){
	print "Sanity check passed.. \n";
	pull_and_merge();
	# pull_repo("testing");
	# pull_repo("live");
	# merge_testing();
}
else{
	print "Sanity check failed.. \n";
}


# my $pull_live = `git -C $live_site_path pull`;
# print "Pulling on the live repo..";
# print $pull_live."\n";