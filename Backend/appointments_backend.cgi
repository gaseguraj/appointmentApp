#!C:\xampp\perl\bin\perl.exe
print "Content-type: text/html\n\n";
use DBI;
use strict;
use JSON;
use Data::Dumper;
use CGI;

my $driver   = "SQLite";
my $database = "appointment.db";
my $dsn      = "DBI:$driver:dbname=$database";
my $userid   = "";
my $password = "";
my $dbh      = DBI->connect( $dsn, $userid, $password, { RaiseError => 1 } )
  or die $DBI::errstr;

#CGI Object
my $cgi = CGI->new;
my $action = $cgi->param('action');

#Function to retrieve data
sub retrieveData{
    my $tempParam = @_[0];
    my $sql = "SELECT date, detail from APPOINTMENT";
    
    #Check Param
    if($tempParam != ""){
        $sql = $sql . " where detail LIKE '%".$tempParam."%'";
    }
   
    my $query = $dbh->prepare($sql);
    my $result = $query->execute() or die $DBI::errstr;
    my $json = JSON->new->utf8;
    my @temp;
    while ( my @record = $query->fetchrow_array() ) {    
        my %json_hash = ("date" => $record[0], "detail" => $record[1]
        );
        push( @temp, \%json_hash );
    }
    print $json->encode( \@temp ) . "\n";
}

#Function to insert new record
sub insertData{
    my $date = @_[0];
    my $detail = @_[1];

    #print "\nDate: " . $date . " Detail: " . $detail;
    my $sql;
    if ($date != ""){ 
        $sql = "INSERT INTO APPOINTMENT (date, detail)
           VALUES ('" . $date . "','" . $detail . "' )";
        #print "\nSql: ".$sql;
        my $query = $dbh->prepare($sql);
        my $result = $query->execute() or die $DBI::errstr;
        
        print "{'success':'true'}\n";
    }
}

#Action
if ( $action eq "retrieve" ) {
    #print "Retrieve\n";
    my $param = $cgi->param('param');
    retrieveData($param);
} else {
    if ( $action eq "create" ) {
        #print "Create";
        my $paramDate = $cgi->param('date');
        my $paramDetail = $cgi->param('detail');
        insertData($paramDate, $paramDetail);
    } else  {
        #print "Default";
    }
}

$dbh->disconnect();
