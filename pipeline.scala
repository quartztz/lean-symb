//> using scala 3.8.4
//> using dep com.lihaoyi::upickle:4.4.3
//> using dep com.lihaoyi::os-lib:0.11.8
import scala.collection.immutable.HashMap
import upickle.default.*

def clean(symb: String): String = "$CURSOR".r.replaceFirstIn(symb, "☐")

@main def abbrev =
  val data = ujson.read(os.read(os.pwd / "abr.json")).obj

  val grpd: Map[String, Map[String, List[String]]] = Map.from(
    data.groupBy(_._2.str).map { case (symb, kvs) =>
      clean(symb) -> Map("abbrevs" -> kvs.keys.toList)
    }
  )

  os.write.over(os.pwd / "grouped.json", write(grpd))
