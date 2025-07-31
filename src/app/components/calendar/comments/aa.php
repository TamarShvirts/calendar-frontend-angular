<?php
header('Content-Type: text/html; charset=UTF-8');
require_once('connect.php');
require_once('scroll.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
 
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>  <!--<script src="meets.js"></script>-->
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script> 
   <title>פרויקט</title>
  
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type='text/javascript' src='myJavascript.js'></script>


  <link rel="stylesheet" href="styles.css">
</head>
<body dir='rtl' style='text-align:center;' onload="sub()">	
	<div class='content'>
    <h1> טבלת בקשות</h1>
    <br> <br><br>

    <caption style='text-align:center;'>חיפושים</caption>
<div> <span> 
<?php
$sql="SELECT ticket_id FROM tickets ";
	  $result=mysqli_query($conn, $sql);
      if (mysqli_num_rows($result) > 0) {
        while($row =$result-> fetch_assoc()) {?>

  <input type="text" id="myInput1" onkeyup="myFunction(event)"  placeholder="ticket_id" list="list1" >
    <datalist id="list1">
    
          <?php  echo"<option>".$row["ticket_id"]."</option>";}}
            ?>
           </span>
        <span>   
<input type="text" id="myInput2" onkeyup="myFunction(event)" placeholder="date" list="list2">
<datalist id="list2">
<?php  $sql="SELECT date FROM tickets ";
          $result=mysqli_query($conn, $sql);
    
          if (mysqli_num_rows($result) > 0) {
            while($row =$result-> fetch_assoc()) {
          echo"<option>".$row["date"]."</option>";}}
            ?> </span>
<span>
<input type="text" id="myInput3" onkeyup="myFunction(event)"  placeholder="unique_identifier" list="list3" >
<datalist id="list3">

<?php     $sql="SELECT unique_identifier FROM tickets ";
          $result=mysqli_query($conn, $sql);
    
          if (mysqli_num_rows($result) > 0) {
            while($row =$result-> fetch_assoc()) {
          echo"<option>".$row["unique_identifier"]."</option>";}}
            ?>
</span>
<span>
<input type="text" id="myInput4" onkeyup="myFunction(event)" placeholder="username" list = "list4">
<datalist id="list4">
<?php  $sql="SELECT  c.username FROM tickets t
          join customer c
          on c.customer_id = t.username ";
          $result=mysqli_query($conn, $sql);
    
          if (mysqli_num_rows($result) > 0) {
            while($row =$result-> fetch_assoc()) {
          echo"<option>".$row["username"]."</option>";}}
            ?>
</span></div>

<br> <br><br>
	 <div id="divc" style="overflow-y: auto;height:180px " >
     <input id="from" type="hidden" value="0"/>
		  <table id="matafottable"class="table table-striped table-hover caption-top"
                    class="searchable reflow-table reflow-table-w-50"
                    class= "table table-striped table-hover caption-top"
                     cellspacing="1" cellpadding="1"
                     style="width: 100%; font-size: 13.5px; padding-bottom: 30px; overflow: auto;">
		  <thead>
			<tr id="mytr">
             <th  scope="col">ticket_id</th>
             <th scope="col">date</th>
             <th scope="col">unique_identifier</th>
             <th scope="col">username</th> 
			</tr>
		  </thead>
		  <tbody id='i'>
      
		  </tbody>
		</table>
        </div>
	</div>
</body>
</html>