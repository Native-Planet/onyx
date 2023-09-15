/-  *albums
/+  *etch
|%
++  enjs-update
  |=  upd=update
  ^-  json
  =/  u  ;;(update upd) 
  ?-  -.u  
      %album-id
    (en-vase !>(+.u)) 
      %album
    (en-vase !>(+.u))
  ==
++  dejs-action
  !.
  =,  dejs:format
  |=  jon=json
  ^-  action
  =<  (decode jon)
  |%
  ++  decode
    %-  of
      :~
        [%create dejs-create]
        [%nuke dejs-nuke] :: Delete an album
        [%add dejs-add]
        [%del dejs-del]
        [%comment dejs-comment]
        [%share dejs-share]
    ==
  ++  dejs-create
    %-  ot  ~[name+so]
  ++  dejs-nuke
    %-  ot  ~[name+so owner+(se %p)]
  ++  dejs-add
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        img-id+so
        src+so
        [%caption (ot ~[who+(se %p) when+nu what+so])]
      ==
  ++  dejs-del
    %-  ot  
      :~  [%album-id (ot ~[name+so owner+(se %p)])]
          [%img-id so]
      ==
  ++  dejs-comment
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        img-id+so
        [%comment (ot ~[who+(se %p) when+nu what+so])]
      ==
  ++  dejs-share
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        receiver+(se %p)
      ==

  --
--
