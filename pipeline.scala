//> using scala 3.8.4
//> using dep com.lihaoyi::upickle:4.4.3
//> using dep com.lihaoyi::os-lib:0.11.8
import scala.collection.immutable.HashMap
import upickle.default.*

def clean(symb: String): String = "$CURSOR".r.replaceFirstIn(symb, "☐")

@main def abbrev =
  val data = ujson.read(os.read(os.pwd / "abbreviations.json")).obj

  val grpd: Map[String, Map[String, List[String]]] = Map.from(
    data.groupMapReduce(kv => clean(kv._2.str))(kv =>
      Map("abbrevs" -> List(kv._1))
    )(_ ++ _)
  )

  os.write.over(os.pwd / "grouped.json", write(grpd))
