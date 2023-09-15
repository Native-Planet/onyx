|%
+$  name  @t
+$  src  @t
+$  img-id  @t
+$  owner  @p
+$  comment  [who=@p when=@da what=@t]
+$  comments  ((mop @da comment) gth)
+$  image  [=src caption=comment =comments] 
+$  images  (map img-id image)
+$  shared  (list @p)
+$  album-id  [=name =owner]
+$  album-ids  (list album-id)
+$  album  [=name =owner =shared =images]
+$  albums  (map album-id album)
+$  action
  $%  [%create =name] :: Create album
      [%nuke =album-id] :: Delete an album
      [%add =album-id =img-id =src caption=comment] :: add an image
      [%del =album-id =img-id] :: delete an image
      [%comment =album-id =img-id =comment] :: add comment to an image
      [%share =album-id receiver=@p] :: share album with user
  ==
+$  update
  $%  [%album-id =album-ids]
      [%album =album]
  ==
--
