// Client stored iPhone info.  The ID is GUID.
struct Client: Codable, CustomStringConvertible {
    let id: String
    let at: Date
    let name: String
    let type: String
    let systemVersion: String
    
    var description: String {
        return "(id: \(id), at: \(at), name: \(name), type: \(type), version: \(systemVersion))"
    }
}

// Session stores name („Labbaði í mat“) and description („Labbaði löngu leiðina, krækti fyrir kelduna“)
struct Session: Codable, CustomDebugStringConvertible {
    let id: Int
    let clientID: String
    let at: Date
    let name: String
    let description: String
    let saved: Bool
    
    var debugDescription: String {
        return "(id: \(id), clientID: \(clientID), at: \(at), name: \(name), "
            + "description: \(String(describing: description)), saved: \(saved)"
    }
}

// Metadata stores x,y,z accelerometer data collected.
struct Metadata: Codable {
    let id: Int
    let sessionID: Int
    let at: Date
    let accX: Int
    let accY: Int
    let accZ: Int
}

// Payload is used to transfer data to server
struct Payload: Codable {
    let client: Client
    let session: Session
    let data: [Metadata]
}

